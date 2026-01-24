import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cancelHostedGameRequest } from "@/services/client/clientService";

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/ui/image-header"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import type { HostedGameDTO } from "@/types/hostedGame_type"
import {  getUpcomingHostedGamesByUser } from "@/services/client/clientService"
import HostedGameCard from "@/components/ReusableComponents/HostedGameCArd"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useToaster } from "@/hooks/ui/useToaster"

const UpcomingHostedGames = () => {
  const navigate = useNavigate()
  const [games, setGames] = useState<HostedGameDTO[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialog, setCancelDialog] = useState<{
  isOpen: boolean;
  game: HostedGameDTO | null;
}>({
  isOpen: false,
  game: null,
});

const [cancelReason, setCancelReason] = useState("");
const [cancelLoading, setCancelLoading] = useState(false);

const { successToast, errorToast } = useToaster();


  const pageSize = 3
  const currentUserId = useSelector(
  (state: RootState) => state.client.client?.userId
)

  const fetchHostedGames = useCallback(async () => {
    try {
      setLoading(true)

      const res = await getUpcomingHostedGamesByUser({
        page: currentPage,
        limit: pageSize,
        search: "",
      })

      if (res.success) {
        setGames(res.games)
        setTotal(res.total)
        setError(null)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError("Failed to fetch hosted games")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchHostedGames()
  }, [fetchHostedGames])

  const totalPages = Math.ceil(total / pageSize);

  const handleCancelHostedGame = async () => {
  if (!cancelDialog.game) return;

  if (!cancelReason.trim()) {
    errorToast("Please enter a cancellation reason");
    return;
  }

  try {
    setCancelLoading(true);

    await cancelHostedGameRequest(cancelDialog.game._id, cancelReason);

    successToast("Hosted game cancellation request submitted");

    setCancelDialog({ isOpen: false, game: null });
    setCancelReason("");

    fetchHostedGames(); 
  } catch (err: any) {
    errorToast(
      err?.response?.data?.message || "Failed to cancel hosted game"
    );
  } finally {
    setCancelLoading(false);
  }
};

const openCancelDialog = (game: HostedGameDTO) => {
  setCancelDialog({ isOpen: true, game });
};


  if (loading) {
    return <LoadingSkeleton type="card" count={6} />
  }

  if (error) {
    return <ErrorState title="Error" message={error} onRetry={fetchHostedGames} />
  }

  if (total === 0) {
    return (
      <EmptyState
        title="No Hosted Games"
        description="You haven't hosted or joined any upcoming games."
        actionLabel="Host a Game"
        onAction={() => navigate("/host-game")}
      />
    )
  }

  return (
    <>
      <PageHeader
        badge="Hosted Games"
        title="Upcoming Hosted Games"
        description={`You have ${total} upcoming hosted games`}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {games.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No games found on this page.
            </div>
          ) : (
            games.map((game, index) => (
              <HostedGameCard key={game._id} game={game} index={index} currentUserId={currentUserId!} onCancelGame={()=>openCancelDialog(game)} />
            ))
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted"
            }`}
          >
            Previous
          </button>

          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted"
            }`}
          >
            Next
          </button>
        </div>
      )}

      <Dialog
  open={cancelDialog.isOpen}
  onOpenChange={(open) => {
    if (!open) {
      setCancelDialog({ isOpen: false, game: null });
      setCancelReason("");
    }
  }}
>
  <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
    <DialogHeader className="text-center pb-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>

      <DialogTitle className="text-2xl font-bold text-gray-900">
        Cancel Hosted Game
      </DialogTitle>

      <DialogDescription className="text-gray-600 text-lg">
        Please provide a reason to cancel this hosted game.
      </DialogDescription>
    </DialogHeader>

    {/* Game Info */}
    {cancelDialog.game && (
      <div className="py-4 border-y border-gray-100 text-sm space-y-2">
        <p><b>Date:</b> {cancelDialog.game.slotDate}</p>
        <p>
          <b>Time:</b>{" "}
          {cancelDialog.game.startTime} - {cancelDialog.game.endTime}
        </p>
        <p><b>Court:</b> {cancelDialog.game.courtType}</p>
      </div>
    )}

    {/* Reason */}
    <div className="mt-4">
      <label className="text-gray-700 font-medium">
        Cancellation Reason
      </label>
      <textarea
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        placeholder="Explain why you are cancelling this game..."
        className="w-full mt-2 p-3 border border-gray-300 rounded-xl
                   focus:ring-2 focus:ring-red-400 focus:outline-none"
        rows={3}
      />
    </div>

    <DialogFooter className="flex gap-3 pt-6">
      <motion.button
        onClick={() => {
          setCancelDialog({ isOpen: false, game: null });
          setCancelReason("");
        }}
        disabled={cancelLoading}
        className="flex-1 bg-gray-100 hover:bg-gray-200
                   text-gray-700 py-3 rounded-xl font-semibold"
      >
        Keep Game
      </motion.button>

      <motion.button
        onClick={handleCancelHostedGame}
        disabled={cancelLoading}
        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500
                   hover:from-red-600 hover:to-rose-600
                   text-white py-3 rounded-xl font-semibold shadow-lg"
      >
        {cancelLoading ? "Submitting..." : "Submit Request"}
      </motion.button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </>
  )
}

export default UpcomingHostedGames