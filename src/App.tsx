import { ConfigProvider } from "antd";
const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#00b96b",
          borderRadius: 2,

          // 派生变量，影响范围小
          colorBgContainer: "#f6ffed",
        },
      }}
    >
      <div> hellow world</div>
    </ConfigProvider>
  );
};
export default App;
