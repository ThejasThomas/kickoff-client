import { BASE_URL } from "./route";

export const OWNER_ROUTE = {
  REFRESH_SESSION: `${BASE_URL.OWNER}/refresh-session`,
  REFRESH_TOKEN: `${BASE_URL.OWNER}/refresh-token`,
  PROFILE: `${BASE_URL.OWNER}/profile`,
  ADD_TURF: `${BASE_URL.OWNER}/add-turf`,
  UPDATE_TURF:`${BASE_URL.OWNER}/update-turf`,
  GETURFBYID:`${BASE_URL.OWNER}/get-turfdetails`,
  GET_MY_TURF:`${BASE_URL.OWNER}/get-my-turf`,
  ADD_RULES:`${BASE_URL.OWNER}/add-rules`,
  GET_RULES:`${BASE_URL.OWNER}/get-rules`,
  GET_ALL_BOOKINGS:`${BASE_URL.OWNER}/get-all-bookings`,
  UPDATE_PROFILE: `${BASE_URL.OWNER}/update-profile`,
  REQUESTUPDATEPROFILE:`${BASE_URL.OWNER}/request-update-profile`,
  RETRY_APPROVAL: `${BASE_URL.OWNER}/retry-approval`,
  GENERATESLOTS:`${BASE_URL.OWNER}/generateSlots`,
  LOGOUT: `${BASE_URL.OWNER}/logout`,
};
