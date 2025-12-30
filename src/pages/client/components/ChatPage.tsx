import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Users,
  Info,
  X,
  Mail,
  CornerUpRight,
  Trash2,
  Smile,
  Paperclip,
} from "lucide-react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { ChatMessage } from "@/types/chat_message._type";
import type { ChatGroup } from "@/types/chat_group_type";
import { getChatPageData } from "@/services/client/clientService";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  const userId = useSelector((state: RootState) => state.client.client?.userId);
  useEffect(() => {
    const loadChatPage = async () => {
      if (!groupId) return;
      try {
        const res = await getChatPageData(groupId);
        if (res.success) {
          const normalizedMessages = res.messages.map((m: any) => ({
            ...m,
            id: m.id || m._id,
          }));
          setGroup(res.group);
          setMessages(normalizedMessages);
        }
      } catch (err) {
        console.error("Failed to load chat page", err);
      } finally {
        setLoading(false);
      }
    };
    loadChatPage();
  }, [groupId]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    if (userId) socket.emit("registerUser", userId);
    return () => {
      socket.disconnect();
    };
  }, [userId]);
  useEffect(() => {
    const handleTyping = ({
      userId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) =>
        isTyping
          ? prev.includes(userId)
            ? prev
            : [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    };
    socket.on("userTyping", handleTyping);
    return () => {
      socket.off("userTyping", handleTyping);
    };
  }, []);
  useEffect(() => {
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("userOnline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    socket.on("userOffline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);
  useEffect(() => {
    const handleDelete = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isDeleted: true, text: "" } : msg
        )
      );
    };

    socket.on("messageDeleted", handleDelete);

    return () => {
      socket.off("messageDeleted", handleDelete);
    };
  }, []);

  useEffect(() => {
    if (!groupId) return;

    socket.emit("joinGroup", groupId);

    return () => {
      socket.emit("leaveGroup", groupId);
    };
  }, [groupId]);

  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !groupId || !userId) return;

    socket.emit("sendMessage", {
      groupId,
      text: input,
      senderId: userId,
      replyTo: replyTo
        ? {
            messageId: replyTo.id,
            senderId: replyTo.senderId,
            text: replyTo.text,
          }
        : undefined,
    });

    setInput("");
    setReplyTo(null);
  };
  const isUserOnline = (id: string) => onlineUsers.includes(id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      "#0d9488",
      "#0891b2",
      "#0284c7",
      "#4f46e5",
      "#7c3aed",
      "#c026d3",
    ];
    const index = (userId?.length || 0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Syncing messages...
          </p>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="flex h-[100dvh] flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="z-30 border-b bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowMembers(true)}
            >
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                  <Users className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight leading-none group-hover:text-primary transition-colors">
                  {group.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-xs font-medium text-muted-foreground">
                    {group.membersInfo.length} Members
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowMembers(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-secondary transition-colors"
          >
            <Info className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-3xl bg-secondary p-8">
                <Send className="h-12 w-12 text-primary opacity-50" />
              </div>
              <h3 className="text-xl font-bold">No messages yet</h3>
              <p className="text-muted-foreground">
                Start the conversation with your team.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === userId;
              const sender = group.membersInfo.find(
                (m) => m.userId === msg.senderId
              );
              const senderName = sender?.fullName || "Member";
              const reply = msg.replyTo;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 animate-slide-in group",
                    isMine ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isMine && (
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm mt-1"
                      style={{ backgroundColor: getAvatarColor(msg.senderId) }}
                    >
                      {getInitials(senderName)}
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex max-w-[80%] flex-col gap-1.5",
                      isMine ? "items-end" : "items-start"
                    )}
                  >
                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "relative rounded-3xl px-4 py-2.5 shadow-xs border",
                        isMine
                          ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                          : "bg-card border-border rounded-tl-sm"
                      )}
                    >
                      {/* Reply context */}
                      {reply && (
                        <div
                          className={cn(
                            "mb-2 p-2 rounded-xl text-xs border-l-4",
                            isMine
                              ? "bg-black/10 border-white/30"
                              : "bg-muted border-primary/30"
                          )}
                        >
                          <p className="font-bold opacity-70">
                            {reply.senderId === userId
                              ? "You"
                              : group.membersInfo.find(
                                  (m) => m.userId === reply.senderId
                                )?.fullName || "Unknown"}
                          </p>
                          <p className="truncate italic">{reply.text}</p>
                        </div>
                      )}

                      {!isMine && (
                        <span className="block mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                          {senderName}
                        </span>
                      )}

                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          msg.isDeleted && "italic opacity-50"
                        )}
                      >
                        {msg.isDeleted ? "This message was deleted" : msg.text}
                      </p>

                      {/* Action buttons (only visible on hover for desktop) */}
                      {!msg.isDeleted && (
                        <div
                          className={cn(
                            "absolute top-0 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                            isMine ? "right-full mr-2" : "left-full ml-2"
                          )}
                        >
                          <button
                            onClick={() => setReplyTo(msg)}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                            title="Reply"
                          >
                            <CornerUpRight className="h-4 w-4" />
                          </button>
                          {isMine && (
                            <button
                              onClick={() =>
                                socket.emit("deleteMessage", {
                                  messageId: msg.id,
                                  groupId,
                                  userId,
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer / Input Area */}
      <footer className="border-t bg-background p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 px-4 text-[11px] font-medium text-muted-foreground animate-pulse">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
              <span>
                {typingUsers
                  .map(
                    (id, i) =>
                      group.membersInfo.find((m) => m.userId === id)
                        ?.fullName || "Someone"
                  )
                  .join(", ")}{" "}
                is typing...
              </span>
            </div>
          )}

          {replyTo && (
            <div className="flex items-center justify-between rounded-2xl bg-secondary/50 border border-border p-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <div className="text-xs">
                  <p className="font-bold text-primary">
                    Replying to{" "}
                    {group.membersInfo.find(
                      (m) => m.userId === replyTo.senderId
                    )?.fullName || "Member"}
                  </p>
                  <p className="truncate text-muted-foreground max-w-md">
                    {replyTo.text}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-secondary border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all px-4 py-2.5 shadow-xs">
     
              <textarea
                rows={1}
                placeholder="Message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 resize-none placeholder:text-muted-foreground/60"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (groupId && userId) {
                    if (e.target.value.trim())
                      socket.emit("typing", { groupId, userId });
                    else socket.emit("stopTyping", { groupId, userId });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </footer>

      {/* Member Info Panel */}
      {showMembers && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setShowMembers(false)}
        >
          <div className="flex-1 bg-black/20 backdrop-blur-xs" />
          <div
            className="w-full max-w-sm bg-card border-l shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-xl font-bold">Group Details</h3>
                <button
                  onClick={() => setShowMembers(false)}
                  className="rounded-xl p-2 hover:bg-secondary transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="h-24 w-24 rounded-[2rem] bg-primary flex items-center justify-center text-primary-foreground shadow-xl">
                    <Users className="h-12 w-12" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{group.name}</h4>
                    <p className="text-muted-foreground mt-1">
                      {group.membersInfo.length} Total Members
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                    Members List
                  </h5>
                  <div className="space-y-2">
                    {group.membersInfo.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center gap-4 rounded-2xl p-3 hover:bg-secondary transition-colors group"
                      >
                        <div className="relative">
                          <div
                            className="h-11 w-11 flex items-center justify-center rounded-2xl text-white font-bold text-sm shadow-sm"
                            style={{
                              backgroundColor: getAvatarColor(member.userId),
                            }}
                          >
                            {getInitials(member.fullName)}
                          </div>
                          {isUserOnline(member.userId) && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate group-hover:text-primary transition-colors">
                            {member.fullName}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate">
                              {member.email || "No email provided"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isUserOnline(member.userId)
                              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                              : "bg-muted"
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
