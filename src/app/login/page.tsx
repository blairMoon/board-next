"use client";

import { Form, Input, Button, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormValues>();
  const { Title } = Typography;

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await res.json();
    if (res.ok) {
      message.success(result.message || "로그인 성공");
      router.push("/main");
    } else {
      message.error(result.message || "로그인 실패");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formBox}>
        <Image
          src="/login.png" // login 이미지로 변경 (필요시 signup.png 재사용 가능)
          alt="Board 로그인"
          style={{ objectFit: "contain" }}
          width={200}
          height={200}
        />

        <Form
          style={{ width: 350 }}
          layout="horizontal"
          labelCol={{ span: 6, style: { textAlign: "left" } }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit(onSubmit)}
          colon={false}
        >
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
              로그인
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span>회원이 아니신가요? </span>
          <a
            onClick={() => router.push("/register")}
            style={{ color: "#5f0080", fontWeight: "bold", cursor: "pointer" }}
          >
            회원가입
          </a>
        </div>
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
