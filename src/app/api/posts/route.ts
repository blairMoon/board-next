import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// ✅ 전체 게시글 목록 조회 (SSR, 클라이언트 fetch 둘 다 가능)
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content, thumbnail } = await req.json();

  const post = await prisma.post.create({
    data: {
      title,
      content,
      thumbnail,
      authorId: 1, // ⚠️ 실제로는 인증된 사용자 ID로 바꿔야 함
    },
  });

  return NextResponse.json(
    { message: "게시글 작성 성공", post },
    { status: 201 }
  );
}
