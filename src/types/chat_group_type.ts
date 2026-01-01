export interface ChatGroupMember {
  userId: string;
  fullName: string;
  email: string;
}

export interface ChatGroup {
  _id: string;
  name: string;
  hostedGameId: string;
  adminId: string;
  members: string[];
  membersInfo: ChatGroupMember[];
  createdAt?: string;

  lastMessage?: string;
  lastMessageTime?: string;
}
