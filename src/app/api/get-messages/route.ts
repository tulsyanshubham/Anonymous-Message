import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, //user with matching id
            { $unwind: "$messages" }, //unwind messages array kind of like "..." opration
            { $sort: { "messages.createdAt": -1 } }, //sort messages by createdAt in descending order
            { $group: { _id: "$_id", messages: { $push: "$messages" } } } //group messages back into an array having same id
        ]);
        if(!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        if(user.length === 0) {
            return Response.json({
                success: false,
                message: "No messages found"
            }, { status: 200 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })

    } catch (error) {
        console.log("An unexpected error occurred", error)
        return Response.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }
}