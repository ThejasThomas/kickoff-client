import { adminLogout } from "@/store/slices/admin_slice";
import { store } from "@/store/store";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_PRIVATE_API_URL;

export const adminAxiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/_ad`,
    withCredentials: true
});

let isRefreshing=false;

adminAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error)=>{
        const originalRequest = error.config;

        if(error.response?.status===401 && !originalRequest._retry ){
            originalRequest._retry =true;
            if(!isRefreshing) {
                isRefreshing =true;
                try{
                    await adminAxiosInstance.post('/admin/refresh-token');
                    isRefreshing = false;
                    return adminAxiosInstance(originalRequest);
                } catch(refreshError) {
                    isRefreshing =false;
                }
            }
        }
    }
)
