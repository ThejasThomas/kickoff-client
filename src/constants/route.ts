export const BASE_URL = {
  CLIENT: "/_cl/client",
  OWNER: "/_ow/turfOwner",
  ADMIN: "/_ad/admin",
} as const;

export type BASE_URL = typeof BASE_URL[keyof typeof BASE_URL];
