import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }
  
  return NextResponse.json({ 
    message: "认证成功", 
    user: session.user 
  });
}