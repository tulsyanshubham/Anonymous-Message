import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    // const user : User = session?.user as User;
    const user: User = session?.user;
    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true });
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "User status updated to accept messages",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(AuthOptions)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const user: User = session?.user;
    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })

    } catch (error) {

        console.log("Failed to find user")
        return Response.json({
            success: false,
            message: "Failed to find user"
        }, { status: 500 })
    }
}