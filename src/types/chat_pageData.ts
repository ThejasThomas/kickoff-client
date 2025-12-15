import type { ChatMessage } from "./chat_message._type";

export interface ChatPageData {
  success: boolean;
  group: ChatGroup;
  messages: ChatMessage[];
}

export interface ChatGroup {
  _id: string;
  name: string;
  hostedGameId: string;
  adminId: string;
  members: string[];
  membersInfo: {
    userId: string;
    fullName: string;
    email: string;
  }[];
  createdAt?: string;
}
