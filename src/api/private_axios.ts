import { ADMIN_ROUTES } from "@/constants/admin_route";
import { CLIENT_ROUTE } from "@/constants/client_route";
import { OWNER_ROUTE } from "@/constants/owner_route";
import { adminLogout } from "@/store/slices/admin_slice";
import { clientLogout } from "@/store/slices/client_slice";
import { turfOwnerLogout } from "@/store/slices/turfOwner_slice";
import { store } from "@/store/store";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PRIVATE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    console.log("originalReq", originalRequest);

    const urlPart = originalRequest?.url?.split("/")[1] || "";
    console.log(urlPart);
    let role: "_cl" | "_ad" | "_ow" | "" = "";

    switch (urlPart) {
      case "_cl":
        role = "_cl";
        break;
      case "_ad":
        role = "_ad";
        break;
      case "_ow":
        role = "_ow";
        break;
      default:
        role = "";
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const refreshEndpoint =
          role === "_ad"
            ? ADMIN_ROUTES.REFRESH_TOKEN
            : role === "_cl"
            ? CLIENT_ROUTE.REFRESH_TOKEN
            : role === "_ow"
            ? OWNER_ROUTE.REFRESH_TOKEN
            : "";

        try {
          if (!refreshEndpoint) {
            handleLogout(role);
            return Promise.reject(error);
          }
          await axiosInstance.post(refreshEndpoint);

          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          handleLogout(role);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
const handleLogout = (role: string) => {
  switch (role) {
    case "_cl":
      store.dispatch(clientLogout());
      window.location.href = "/";
      break;
    case "_ad":
      store.dispatch(adminLogout());
      window.location.href = "/admin";
      break;
    case "_ow":
      store.dispatch(turfOwnerLogout());
      window.location.href = "/turfOwner";
      break;
    default:
      window.location.href = "/";
  }
  toast("Please login again");
};
