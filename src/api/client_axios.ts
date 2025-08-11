import axios from "axios";

export const clientAxiosInstance = axios.create ({
    baseURL:import.meta.env.VITE_PRIVATE_API_URL + "/_cl",
    withCredentials:true
});

let isRefreshing=false;

clientAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error)=>{
        const originalRequest = error.config;

        if(error.response?.status===401 && !originalRequest._retry ){
            originalRequest._retry =true;
            if(!isRefreshing) {
                isRefreshing =true;
                try{
                    await clientAxiosInstance.post('/client/refresh-token');
                    isRefreshing = false;
                    return clientAxiosInstance(originalRequest);
                } catch(refreshError) {
                    isRefreshing =false;
                }
            }
        }
    }
)