import { NextResponse } from "next/server";
import { sign, verify } from "jsonwebtoken";


const JWT_SECRET =
  process.env.JWT_SECRET || "elemental-emoji-creator-secret-key";

// Token expiration time (15 minutes)
const TOKEN_EXPIRY = "15m";

export async function POST(request: Request) {
  try {
    
    console.log("Generating token...");
    
    const payload = {
      
      access: "elemental-emoji-creator",
      
    };

    
    const token = sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    
    return NextResponse.json({
      success: true,
      accessToken: token,
      expiresIn: 15 * 60, 
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
