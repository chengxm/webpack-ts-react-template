import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

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
    path: "/home",
    element: <Home />,
  },
]);
