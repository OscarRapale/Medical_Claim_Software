import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
      navigate("/claims");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Login failed. Please try again.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #1a1f3c 0%, #0d1025 100%)",
      }}
    >
      {/* Left side - Branding */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
          }}
        >
          <FileTextOutlined style={{ fontSize: 40, color: "#fff" }} />
        </div>
        <Title
          level={1}
          style={{
            color: "#fff",
            margin: 0,
            fontSize: 42,
            letterSpacing: "-1px",
          }}
        >
          Medical Claims Management
        </Title>

        {/* Decorative elements */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            gap: 12,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === 2 ? "#6366f1" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right side - Login Form */}
      <div
        style={{
          width: "480px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 60px",
          borderRadius: "24px 0 0 24px",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <Title
            level={2}
            style={{
              margin: 0,
              color: "#1a1f3c",
              fontWeight: 600,
            }}
          >
            Welcome back
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Sign in to continue to your dashboard
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your email"
              style={{
                borderRadius: "10px",
                height: "50px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Password</Text>}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your password"
              style={{
                borderRadius: "10px",
                height: "50px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16, marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: "50px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: 16,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
