import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/model/message";

export async function POST(req: Request) {
    await dbConnect();

    const { username, content } = await req.json();
    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        //is user accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message); //add message to user messages array
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully",
            newMessage
        }, { status: 200 })

    } catch (error) {
        console.log("Error adding message", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}