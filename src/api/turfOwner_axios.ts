import axios from "axios";

export const    turfOwnerAxiosInstance = axios.create ({
    baseURL:import.meta.env.VITE_PRIVATE_API_URL,
    withCredentials:true
})