export interface ReplyTo {
  messageId: string;
  senderId?: string;
  text?: string;
}
export interface ChatMessage{
    id:string;
    groupId:string;
    senderId:string;
    text:string;
    isDeleted?:boolean;
    replyTo?: ReplyTo;
    createdAt:string;
}