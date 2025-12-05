import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import NoAccess from "@/pages/NoAccess";

export const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
        handle: {
          title: "首页",
        },
      },
      {
        path: "/403",
        element: <NoAccess />,
        handle: {
          title: "无权限访问",
        },
      },
    ],
  },
]);
