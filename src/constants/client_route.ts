import { BASE_URL } from "./route";

export const CLIENT_ROUTE ={
    REFRESH_SESSION:`${BASE_URL.CLIENT}/refresh-session`,
    GET_TURF:`${BASE_URL.CLIENT}/getturfs`,
    GETSLOTS:`${BASE_URL.CLIENT}/getslots`,
    GETURFBYID:`${BASE_URL.CLIENT}/get-turfdetails`,
    REFRESH_TOKEN:`${BASE_URL.CLIENT}/refresh-token`,
    LOGOUT:`${BASE_URL.CLIENT}/logout`,
}