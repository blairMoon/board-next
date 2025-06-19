import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET: 게시글 상세 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ message: "잘못된 ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      comments: true,
    },
  });

  if (!post) {
    return NextResponse.json({ message: "게시글 없음" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// ✅ PUT: 게시글 수정
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ message: "잘못된 ID" }, { status: 400 });
  }

  const { title, content, thumbnail } = await req.json();

  try {
    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        thumbnail,
      },
    });

    return NextResponse.json(
      { message: "게시글 수정 완료", post: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ 게시글 수정 오류:", err);
    return NextResponse.json({ message: "게시글 수정 실패" }, { status: 500 });
  }
}

// ✅ DELETE: 게시글 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ message: "잘못된 ID" }, { status: 400 });
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "게시글 삭제 완료" }, { status: 200 });
  } catch (err) {
    console.error("❌ 게시글 삭제 오류:", err);
    return NextResponse.json({ message: "게시글 삭제 실패" }, { status: 500 });
  }
}
