import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password, role } = reqBody; // Destructure the new 'role' field
    console.log(reqBody);

    // Basic validation for new 'role' field
    if (!role) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }
    
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // Add the role to the new user document
    });
    const savedUser = await newUser.save();

    // send verification email
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json(
      { message: "User created successfully", user: savedUser },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}