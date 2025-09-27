import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email?: string;
}

export const getDataFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies");
      return null;
    }

    // Wrap jwt.verify in a Promise for async/await
    const decodedToken = await new Promise<TokenPayload>((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET!, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded as TokenPayload);
      });
    });

    return decodedToken.id || null;
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return null;
  }
};
