import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        //validate with zod
        const result = verifySchema.safeParse({code});
        // console.log(username, result)
        // console.log(typeof(result))
        // console.log(result.success) //TODO remove
        if (!result.success) {
            const codeError = result.error.format().code?._errors || [];
            return Response.json({
                success: false,
                message: codeError?.length > 0 ? codeError.join(', ') : "Invalid query parameter",
            }, { status: 400 })
        }

        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 500 });
        }
        console.log(user.verifycode, code)
        const isCodeValid = user.verifycode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Code is valid",
            }, { status: 200 });
        }
        else if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Invalid code",
            }, { status: 400 });
        }
        else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code is expired. Please Sign up again to get a new code.",
            }, { status: 400 });
        }

    } catch (error) {
        console.log("Error verifying user: ", error);
        return Response.json({
            success: false,
            message: "Error checking username",
        }, { status: 500 })
    }
}