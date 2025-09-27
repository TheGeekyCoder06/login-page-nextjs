import { NextResponse } from "next/server";

export async function GET() {
    try{
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.cookies.set("token", "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
        return response;
    }catch(error:any){
        console.error("Logout error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}