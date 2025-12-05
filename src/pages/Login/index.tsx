// src/pages/login/index.tsx
import { useState } from "react";
import { Form, Input, Button, message, Tabs } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { LoginParams } from "./index.d";
import "./index.css";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const setUserInfo = useStore((state) => state.setUserInfo);
  const onFinish = async (values: LoginParams) => {
    setLoading(true);
    try {
      if (activeTab === "login") {
        if (values.username === "admin" && values.password === "123456") {
          messageApi.open({
            type: "success",
            content: "登录成功",
          });
          setUserInfo({
            name: "admin",
            id: "12313",
            token: "123123123",
          });
          navigate("/");
        } else {
          messageApi.open({
            type: "error",
            content: "用户名或密码错误",
          });
        }
      } else {
        messageApi.open({
          type: "success",
          content: "注册成功，请登录",
        });
        setActiveTab("login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 定义 tabs 项
  const tabItems = [
    {
      key: "login",
      label: "登录",
      children: (
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "register",
      label: "注册",
      children: (
        <Form
          name="registerForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="login-page">
      {/* 左侧欢迎栏 */}
      {contextHolder}
      <div className="login-left">
        <div className="welcome-logo">🅱</div>
        <h1>Welcome</h1>
        <p>{activeTab === "login" ? "欢迎使用后台管理系统" : "创建新账户"}</p>
      </div>

      {/* 右侧登录表单 */}
      <div className="login-right">
        <div className="login-form-container">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
