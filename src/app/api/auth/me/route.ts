// ✅ App Router 스타일 (Next.js 13~14 기준)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "@/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "인증 정보 없음" }, { status: 401 });
    }

    const decoded = verifyToken(token) as JwtPayload;
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ message: "사용자 없음" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: "인증 오류" }, { status: 401 });
  }
}
