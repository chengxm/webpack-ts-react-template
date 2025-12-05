import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { useStore } from "@/store/useStore";
const App = () => {
  const themeColor = useStore((state) => state.themeColor);
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: themeColor,
          borderRadius: 2,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default App;
