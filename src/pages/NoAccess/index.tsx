// src/pages/403.tsx
import { Button, Result, Space } from "antd";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 250px)",
        padding: "24px",
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Space wrap>
            <Button type="primary" onClick={handleBackHome}>
              返回首页
            </Button>
            <Button onClick={handleLogin}>重新登录</Button>
          </Space>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
