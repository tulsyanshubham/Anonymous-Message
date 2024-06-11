import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";

const UsernameQuerySchma = z.object({
    username: usernameValidation,
})

export async function GET(req: Request) {
    
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        //validate with zod
        const result = UsernameQuerySchma.safeParse(queryParam);
        // console.log(result.success) //TODO remove
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query parameter",
            }, { status: 400 })
        }

        const existingVerifiedUser = await UserModel.findOne({ username: queryParam.username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is available",
        }, { status: 400 })
    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json({
            success: false,
            message: "Error checking username",
        }, { status: 500 })
    }
}