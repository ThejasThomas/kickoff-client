import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_PRIVATE_API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
