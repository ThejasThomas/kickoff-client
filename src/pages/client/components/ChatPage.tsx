import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Users,
  Info,
  X,
  Mail,
} from "lucide-react";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { ChatMessage } from "@/types/chat_message._type";
import type { ChatGroup } from "@/types/chat_group_type";
import { getChatPageData } from "@/services/client/clientService";

export default function ChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: RootState) => state.client.client?.userId);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("Frontend socket connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    const loadChatPage = async () => {
      if (!groupId) return;

      try {
        const res = await getChatPageData(groupId);
        if (res.success) {
          setGroup(res.group);
          setMessages(res.messages);
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
    });

    setInput("");
  };

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
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];
    const index = (userId?.length || 0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading chat...
          </p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            Group not found
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Back to chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-secondary/30 overflow-hidden">
      <header
        className="flex-shrink-0 z-20 shadow-md backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/10 active:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setShowMembers(true)}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-white/10 active:bg-white/20"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Users className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-semibold text-white leading-tight">
                  {group.name}
                </h2>
                <p className="text-xs text-white/90">
                  {group.membersInfo.length} members
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* <button className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/10 active:bg-white/20">
              <Video className="h-5 w-5 text-white" strokeWidth={2.5} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/10 active:bg-white/20">
              <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
            </button> */}
            <button
              onClick={() => setShowMembers(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/10 active:bg-white/20"
            >
              <Info className="h-5 w-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 overscroll-contain">
        <div className="mx-auto max-w-4xl space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <div
                className="rounded-full p-8"
                style={{
                  background:
                    "linear-gradient(135deg, #10b98120 0%, #05966920 100%)",
                }}
              >
                <Send className="h-14 w-14 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  No messages yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start the conversation!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === userId;
              const sender = group.membersInfo.find(
                (m) => m.userId === msg.senderId
              );
              const senderName = sender?.fullName || "Unknown";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 animate-slide-in ${
                    isMine ? "flex-row-reverse" : ""
                  }`}
                >
                  {!isMine && (
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: getAvatarColor(msg.senderId) }}
                    >
                      {getInitials(senderName)}
                    </div>
                  )}

                  <div
                    className={`flex max-w-[75%] flex-col ${
                      isMine ? "items-end" : "items-start"
                    }`}
                  >
                    {!isMine && (
                      <span className="mb-1 px-1 text-xs font-medium text-muted-foreground">
                        {senderName}
                      </span>
                    )}

                    <div
                      className="rounded-2xl px-4 py-2.5 shadow-sm"
                      style={{
                        backgroundColor: isMine ? "#dcf8c6" : "var(--card)",
                        color: "var(--foreground)",
                        borderBottomRightRadius: isMine ? "4px" : "16px",
                        borderBottomLeftRadius: isMine ? "16px" : "4px",
                      }}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>

                    <span className="mt-1 px-1 text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="flex-shrink-0 border-t bg-card p-3 shadow-lg">
        <div className="mx-auto flex max-w-4xl items-end gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-secondary px-4 py-2">
            {/* <button className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-accent active:scale-95">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </button> */}
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {/* <button className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-accent active:scale-95">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </button> */}
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "var(--muted)",
            }}
          >
            <Send className="h-5 w-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {showMembers && (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in"
          onClick={() => setShowMembers(false)}
        >
          <div className="flex-1 bg-black/50 backdrop-blur-sm" />
          <div
            className="w-full max-w-sm animate-slide-in overflow-y-auto bg-card shadow-2xl sm:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Group Info
                </h3>
                <button
                  onClick={() => setShowMembers(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-secondary active:bg-accent"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Group Info Card */}
            <div className="p-5">
              <div
                className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
                style={{ backgroundColor: "var(--secondary)" }}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  }}
                >
                  <Users className="h-10 w-10 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    {group.name}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Group · {group.membersInfo.length} members
                  </p>
                </div>
              </div>

              {/* Members List */}
              <div className="mt-6">
                <h4 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.membersInfo.length} Members
                </h4>
                <div className="space-y-1">
                  {group.membersInfo.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary"
                    >
                      <div
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                        style={{
                          backgroundColor: getAvatarColor(member.userId),
                        }}
                      >
                        {getInitials(member.fullName)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium text-foreground">
                          {member.fullName}
                        </p>
                        {member.email && (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <Mail className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <p className="truncate text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        )}
                      </div>
                      {member.userId === group.adminId && (
                        <span className="flex-shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
