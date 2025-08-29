import axios from "axios";

export const    turfOwnerAxiosInstance = axios.create ({
    baseURL:`${import.meta.env.VITE_PRIVATE_API_URL}/_ow`,
    withCredentials:true
})

let isRefreshing=false;
turfOwnerAxiosInstance.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const originalRequest=error.config;

        if(error.response?.status ===401 && !originalRequest._retry){
            originalRequest._retry =true;
            if(!isRefreshing){
                isRefreshing=true;
                try{
                    console.log('interceptor aaccessed')
                    await turfOwnerAxiosInstance.post('/turfOwner/refersh-token')
                    isRefreshing= false;
                    return turfOwnerAxiosInstance(originalRequest);
                }catch(refreshError){
                    isRefreshing =false;
                } 
            }
        }
    }
)
