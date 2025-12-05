import { BASE_URL } from "./route";

export const CLIENT_ROUTE ={
    REFRESH_SESSION:`${BASE_URL.CLIENT}/refresh-session`,
    GET_TURF:`${BASE_URL.CLIENT}/getturfs`,
    GETNEARBYTURF:`${BASE_URL.CLIENT}/getnearbyturf`,
    GETSLOTS:`${BASE_URL.CLIENT}/getslots`,
    UPDATE_USER_DETAILS:`${BASE_URL.CLIENT}/update-user-details`,
    GETBOOKINGSTURF:`${BASE_URL.CLIENT}/getbookingturf`,
    GET_PAST_BOOKINGS:`${BASE_URL.CLIENT}/get-past-bookings`,
    BOOKSLOT:`${BASE_URL.CLIENT}/bookslots`,
    GET_UPCOMING_BOOKINGS:`${BASE_URL.CLIENT}/get-upcoming-bookings`,
    GETPROFILE:`${BASE_URL.CLIENT}/get-user-profile`,
    GETURFBYID:`${BASE_URL.CLIENT}/get-turfdetails`,
    ADDMONEY:`${BASE_URL.CLIENT}/add-money`,
    GET_TRANSACTION_HISTORY:`${BASE_URL.CLIENT}/transactionhistory`,
    GET_WALLET_BALANCE:`${BASE_URL.CLIENT}/walletbalance`,
    REFRESH_TOKEN:`${BASE_URL.CLIENT}/refresh-token`,
    LOGOUT:`${BASE_URL.CLIENT}/logout`,
}