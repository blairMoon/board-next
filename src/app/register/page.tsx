"use client";

import { Form, Input, Button, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ 추가

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<FormValues>();
  const { Title } = Typography;
  const router = useRouter(); // ✅ 추가

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      message.success(result.message);
      router.push("/login"); // ✅ 회원가입 성공 시 로그인 페이지로 이동
    } else {
      message.error(result.message || "회원가입 실패");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formBox}>
        <Image
          src="/signup.png" // public 폴더 기준 경로
          alt="Board 로고"
          style={{ objectFit: "contain" }} // 비율 유지 + 여백
          width={200}
          height={200}
        />

        <Form
          style={{ width: 350 }}
          layout="horizontal"
          labelCol={{ span: 6, style: { textAlign: "left" } }} // ← 여기!
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit(onSubmit)}
          colon={false}
        >
          <Form.Item label="이름">
            <Controller
              name="name"
              control={control}
              rules={{ required: "이름을 입력해주세요" }}
              render={({ field }) => (
                <Input
                  style={{ width: "100%", height: 45 }}
                  {...field}
                  placeholder="이름 입력"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="이메일">
            <Controller
              name="email"
              control={control}
              rules={{ required: "이메일을 입력해주세요" }}
              render={({ field }) => (
                <Input
                  style={{ width: "100%", height: 45 }}
                  {...field}
                  placeholder="이메일 입력"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="비밀번호">
            <Controller
              name="password"
              control={control}
              rules={{ required: "비밀번호를 입력해주세요" }}
              render={({ field }) => (
                <Input.Password
                  style={{ width: "100%", height: 45 }}
                  {...field}
                  placeholder="비밀번호 입력"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              block
              style={styles.button}
            >
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
const styles: {
  wrapper: React.CSSProperties;
  formBox: React.CSSProperties;
  title: React.CSSProperties;
  button: React.CSSProperties;
} = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 16px",
  },
  formBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    maxWidth: 600,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "48px 40px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },
  title: {
    marginBottom: 32,
    fontWeight: 600,
    textAlign: "center",
  },
  button: {
    width: 150,
    height: 45,
    marginTop: 24,
    borderRadius: 8,
    fontWeight: "bold",
    backgroundColor: "#5f0080",
    borderColor: "#5f0080",
  },
};
