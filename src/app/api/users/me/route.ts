import { getDataFromToken } from "@/helpers/getDatafromToken";

getDataFromToken
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function GET(request : NextRequest) {
    try{
        const userID = await getDataFromToken(request);
        const user = await User.findOne({_id : userID}).select("-password -__v -createdAt -updatedAt");
        return NextResponse.json({ message: "User found", data: user }, { status: 200 });
        
    }catch(error:any){
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}