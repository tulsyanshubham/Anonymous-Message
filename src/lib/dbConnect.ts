import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("DB Connected Successfully");
        connection.isConnected = db.connections[0].readyState;

    } catch (error) {
        console.log("DB Connection Failed: ", error);
        process.exit(1);
    }
}

export default dbConnect;