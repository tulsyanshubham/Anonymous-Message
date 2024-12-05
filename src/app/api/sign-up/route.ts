import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        // If a verified username exists, return an error
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, { status: 400 });
        }

        const verifycode = Math.floor(100000 + Math.random() * 899999).toString();

        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        // If an email exists
        if (existingUserVerifiedByEmail) {
            // If the email is already verified, return an error
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email.",
                }, { status: 400 });
            }
            // If the email is not verified, update the user with the new username and password
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifycode = `${verifycode}`;
                console.log(verifycode);
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();
            }
        }
        // If the email does not exist, create a new user
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifycode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        //Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifycode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                }, { status: 500 }
            );
        }
        // If the email is sent successfully, return a success message
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email.",
            }, { status: 201 }
        );

        return Response.json({ success: true, message: "User registered" });
    } catch (error) {
        console.error("Error registering User ", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User",
            }, { status: 500 }
        );
    }
}
