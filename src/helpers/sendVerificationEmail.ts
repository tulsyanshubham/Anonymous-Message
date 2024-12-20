import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, vrificationCode: string): Promise<ApiResponse> {
    try {
        const emailResponse = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous-Message | Verification Code',
            react: VerificationEmail({username, otp : vrificationCode}),
        });
        console.log("Email response:", emailResponse);
        if(emailResponse?.error) {
            // console.error("Error sending verification email: ", emailResponse.error);
            return {
                success: false,
                message: "Error sending verification email",
            };
        }
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