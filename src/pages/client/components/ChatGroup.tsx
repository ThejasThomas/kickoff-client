
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle, Users, ChevronRight } from "lucide-react"
import { getMyChatGroups } from "@/services/client/clientService"
import type { ChatGroup } from "@/types/chat_group_type"

export default function ChatGroupsList() {
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const res = await getMyChatGroups()
      console.log("res", res)
      if (res.success) {
        setGroups(res.groups)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading your chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header
        className="sticky top-0 z-10 shadow-lg backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      >
        <div className="px-5 py-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
              style={{ background: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(10px)" }}
            >
              <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Turf Bookings</h1>
              <p className="text-xs text-white/90 font-medium">
                {groups.length} {groups.length === 1 ? "group" : "groups"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-secondary/30 p-3">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <div
              className="rounded-full p-8"
              style={{
                background: "linear-gradient(135deg, #10b98120 0%, #05966920 100%)",
              }}
            >
              <MessageCircle className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">No group chats yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your turf booking group chats will appear here</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-2">
            {groups.map((group, index) => (
              <div
                key={group._id}
                className="animate-slide-in cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                style={{
                  border: "1px solid var(--border)",
                  animationDelay: `${index * 0.03}s`,
                }}
                onClick={() => navigate(`/chats/${group._id}`)}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      <Users className="h-7 w-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-3"
                      style={{
                        backgroundColor: "#10b981",
                        borderColor: "var(--card)",
                        borderWidth: "3px",
                      }}
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-base font-semibold text-foreground">{group.name}</h3>
                      {group.lastMessageTime && (
                        <span className="flex-shrink-0 text-xs font-medium text-muted-foreground">
                          {group.lastMessageTime}
                        </span>
                      )}
                    </div>

                    {group.lastMessage && (
                      <p className="mt-1 truncate text-sm text-muted-foreground">{group.lastMessage}</p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        <Users className="h-3 w-3 text-accent-foreground" />
                        <span className="text-xs font-medium text-accent-foreground">{group.membersInfo.length}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground/40" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
