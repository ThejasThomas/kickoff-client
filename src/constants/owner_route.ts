import { BASE_URL } from "./route";

export const OWNER_ROUTE = {
  REFRESH_SESSION: `${BASE_URL.OWNER}/refresh-session`,
  REFRESH_TOKEN: `${BASE_URL.OWNER}/refresh-token`,
  PROFILE: `${BASE_URL.OWNER}/profile`,
  ADD_TURF: `${BASE_URL.OWNER}/add-turf`,
  UPDATE_PROFILE: `${BASE_URL.OWNER}/update-profile`,
  RETRY_APPROVAL: `${BASE_URL.OWNER}/retry-approval`,
  LOGOUT: `${BASE_URL.OWNER}/logout`,
};
