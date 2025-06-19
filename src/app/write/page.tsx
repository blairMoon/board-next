"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, message } from "antd";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import AppHeader from "../../components/header";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import "react-markdown-editor-lite/lib/index.css";

type FormValues = {
  title: string;
  content: string;
  thumbnail?: string;
};

export default function WritePage() {
  const { control, handleSubmit, watch, reset } = useForm<FormValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  // ✅ [1] 수정 모드일 경우, 글 데이터 불러와서 reset
  useEffect(() => {
    if (!postId) return;
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        reset({
          title: data.title,
          content: data.content,
          thumbnail: data.thumbnail || "",
        });
      });
  }, [postId, reset]);

  // ✅ [2] 작성 모드일 경우, 폼 초기화
  useEffect(() => {
    if (!postId) {
      reset({
        title: "",
        content: "",
        thumbnail: "",
      });
    }
  }, [postId, reset]);

  const onSubmit = async (data: FormValues) => {
    const method = postId ? "PUT" : "POST";
    const endpoint = postId ? `/api/posts/${postId}` : "/api/posts";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      message.success(postId ? "게시글 수정 성공!" : "게시글 등록 성공!");
      router.push(`/posts/${postId || result.post.id}`);
    } else {
      message.error(result.message || "작업 실패");
    }
  };

  const thumbnailUrl = watch("thumbnail");

  return (
    <>
      <AppHeader />
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: 24 }}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* 제목 */}
          <Form.Item label="제목">
            <Controller
              name="title"
              control={control}
              rules={{ required: "제목을 입력해주세요" }}
              render={({ field }) => (
                <Input {...field} placeholder="제목 입력" />
              )}
            />
          </Form.Item>

          {/* 내용 */}
          <Form.Item label="내용">
            <Controller
              name="content"
              control={control}
              rules={{ required: "내용을 입력해주세요" }}
              render={({ field }) => (
                <MdEditor
                  style={{ height: "500px" }}
                  value={field.value}
                  renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                  onChange={({ text }) => field.onChange(text)}
                />
              )}
            />
          </Form.Item>

          {/* 대표 이미지 URL */}
          <Form.Item label="대표 이미지 URL">
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://example.com/image.jpg" />
              )}
            />
          </Form.Item>

          {/* 이미지 미리보기 */}
          {thumbnailUrl && (
            <div style={{ marginBottom: 24 }}>
              <img
                src={thumbnailUrl}
                alt="대표 이미지 미리보기"
                style={{ width: 240, borderRadius: 8 }}
              />
            </div>
          )}

          {/* 등록 버튼 */}
          <Button
            htmlType="submit"
            type="primary"
            style={{ backgroundColor: "#5f0080", borderColor: "#5f0080" }}
          >
            {postId ? "수정" : "등록"}
          </Button>
        </Form>
      </div>
    </>
  );
}
