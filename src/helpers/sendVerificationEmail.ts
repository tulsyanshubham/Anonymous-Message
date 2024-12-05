import { ApiResponse } from "@/types/ApiResponse";
const nodemailer = require('nodemailer');

const mailpsw = process.env.MAILPSW;
const mailid = process.env.MAILID;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: mailid,
        pass: mailpsw
    }
});

export async function sendVerificationEmail(email: string, username: string, vrificationCode: string): Promise<ApiResponse> {
    const mailOptions = {
        from: {
            name: `Anonymous Message`,
            address: mailid,
        },
        to: email,
        subject: 'Sending Password for TipyDo',
        html: `<div style="position: inherit; padding: 20px; margin: 20px auto; width: 80%; max-width: 600px; border-radius: 10px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1); border: 1px solid #fbfbfb;">
        <div style="text-align: center; padding-bottom: 0px;">
            <h2>Hello <div style="color: green">${username}!</div></h2>
          	<h3>Your Verification code is:</h3>
          	<h1 style="color: green">${vrificationCode}</h1>
            <h5>Thank you for registering on our site. We're excited to have you with us.</h5>
        </div>
    </div>`
    };
    try {
        transporter.verify(function (error: Error | null, success: any) {
            console.log("Server is ready to take our messages");
        });
        transporter.sendMail(mailOptions, function (error: any, info: any) {
            console.log('Email sent: ' + info.response);
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verification email: ", emailError);
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
}