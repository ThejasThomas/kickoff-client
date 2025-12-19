import { BASE_URL } from "./route";

export const ADMIN_ROUTES={
    REFRESH_SESSION:`${BASE_URL.ADMIN}/refresh-session`,
    REFRESH_TOKEN:`${BASE_URL.ADMIN}/refresh-token`,
    USERS:`${BASE_URL.ADMIN}/users`,
    TURFS:`${BASE_URL.ADMIN}/turfs`,
    STATUS:`${BASE_URL.ADMIN}/status`,
    ADMIN_WALLET:`${BASE_URL.ADMIN}/wallet`,
    ADMIN_WALLET_TRANSACTIONS:`${BASE_URL.ADMIN}/wallet-transaction`,
    GET_TURFS_REVIEWS:`${BASE_URL.ADMIN}/get-turf-reviews`,
    DELETE_REVIEWS:`${BASE_URL.ADMIN}/delete-review`,
    GET_DASHBOARD:`${BASE_URL.ADMIN}/get-dashboard`,
    LOGOUT:`${BASE_URL.ADMIN}/logout`,
    
}
