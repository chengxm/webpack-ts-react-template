// ...existing code...
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useStore } from "@/store/useStore";

const navigate = useNavigate();

// 新增：统一错误提示助手
const showError = (msg?: string) => {
  if (msg && typeof msg === "string" && msg.trim()) {
    message.error(msg);
  } else {
    message.error("请求出错，请稍后重试");
  }
};

const BASE_URL = "/api"; // 可通过 .env 配置
const TIMEOUT = 10000;

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true, // 携带 Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage / sessionStorage 获取 token
    const token = useStore((state) => state?.userInfo?.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  async (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig;
    const contentType =
      (response.headers && response.headers["content-type"]) || "";

    // 如果是文件/流下载（浏览器端通常为 blob），需要特殊处理：
    // - 直接返回 blob（或 ArrayBuffer）给调用方
    // - 但如果后端在错误情况下以 blob 形式返回 JSON（部分后端会这样），尝试读取并解析 JSON 错误
    if (
      config.responseType === "blob" ||
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/pdf") ||
      contentType.includes("application/zip") ||
      contentType.includes("application/vnd") ||
      contentType.includes("image/")
    ) {
      const data = response.data as Blob;
      if (data && typeof data.text === "function") {
        try {
          const text = await data.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              // 服务器实际返回的是 JSON（可能是错误信息），按原有逻辑处理
              if (parsed && parsed.code && parsed.code !== 200) {
                // 弹窗提示错误信息（如果有）
                showError(
                  parsed.message || parsed.msg || `错误：${parsed.code}`,
                );
                if (parsed.code === 401) {
                  console.warn("登录状态失效，请重新登录");
                  localStorage.removeItem("token");
                  navigate("/login");
                }
                return Promise.reject(parsed);
              }
              // 返回解析后的 JSON
              return parsed;
            } catch (e) {
              // 不是 JSON，说明是真正的文件流，返回 blob
              console.error("读取下载流失败：", e);
              showError("读取下载流失败");
              return data;
            }
          }
        } catch (e) {
          console.error("读取下载流失败：", e);
          return Promise.reject(e);
        }
      }
      return data;
    }

    const res = response.data;

    // 通用响应格式处理
    if (res.code && res.code !== 200) {
      // 例如统一处理登录失效
      if (res.code === 401) {
        console.warn("登录状态失效，请重新登录");
        localStorage.removeItem("token");
        navigate("/login");
      }
      return Promise.reject(res);
    }

    return res;
  },
  async (error) => {
    // 如果 error.response.data 是 Blob（下载流错误），尝试读取并解析为 JSON，以便提取错误信息
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data.text === "function"
    ) {
      try {
        const text = await error.response.data.text();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            // 替换响应 data 以便后续逻辑使用
            error.response.data = parsed;
          } catch {
            // 非 JSON，保持原样
          }
        }
      } catch (e) {
        console.error("解析错误响应流失败：", e);
        showError("解析错误响应流失败");
      }
    }

    // 全局错误处理
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          showError("请求错误");
          break;
        case 401:
          showError("未授权，请重新登录");
          localStorage.removeItem("token");
          navigate("/login");
          break;
        case 403:
          showError("拒绝访问");
          break;
        case 404:
          showError("请求地址不存在");
          break;
        case 500:
          showError("服务器内部错误");
          break;
        default:
          showError(`请求错误：${status}`);
      }
    } else if (error.request) {
      showError("无响应，请检查网络连接");
    } else {
      showError(error.message);
    }

    return Promise.reject(error);
  },
);

// 导出通用请求函数
export default function http<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request({ url, ...config });
}

// 导出实例（方便单独调用）
export { request };
// ...existing code...
