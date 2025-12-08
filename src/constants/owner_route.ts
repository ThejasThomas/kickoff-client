import { BASE_URL } from "./route";

export const OWNER_ROUTE = {
  REFRESH_SESSION: `${BASE_URL.OWNER}/refresh-session`,
  REFRESH_TOKEN: `${BASE_URL.OWNER}/refresh-token`,
  PROFILE: `${BASE_URL.OWNER}/profile`,
  ADD_TURF: `${BASE_URL.OWNER}/add-turf`,
  UPDATE_TURF:`${BASE_URL.OWNER}/update-turf`,
  GET_BOOKED_USER_DETAILS:`${BASE_URL.OWNER}/getbookedclient-details`,
  GETURFBYID:`${BASE_URL.OWNER}/get-turfdetails`,
  GET_MY_TURF:`${BASE_URL.OWNER}/get-my-turf`,
  GET_SINGLE_HOSTED_GAME:`${BASE_URL.OWNER}/get-single-hosted-game`,
  ADD_RULES:`${BASE_URL.OWNER}/add-rules`,
  GET_RULES:`${BASE_URL.OWNER}/get-rules`,
  GET_ALL_BOOKINGS:`${BASE_URL.OWNER}/get-all-bookings`,
  UPDATE_PROFILE: `${BASE_URL.OWNER}/update-profile`,
  GET_CANCEL_REQUESTS:`${BASE_URL.OWNER}/get-cancel-bookings`,
  HANDLE_CANCEL_REQUEST:`${BASE_URL.OWNER}/handle-cancel-request`,
  REQUESTUPDATEPROFILE:`${BASE_URL.OWNER}/request-update-profile`,
  RETRY_APPROVAL: `${BASE_URL.OWNER}/retry-approval`,
  GENERATESLOTS:`${BASE_URL.OWNER}/generateSlots`,
  LOGOUT: `${BASE_URL.OWNER}/logout`,
};
