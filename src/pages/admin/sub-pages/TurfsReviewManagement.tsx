import { adminService } from "@/services/admin/adminService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import { ConfirmationModal } from "@/components/ReusableComponents/ConfirmationModel";

interface Review {
  _id: string;
  comment: string;
  userName: string;
  createdAt: string;
}

const AdminTurfReviews = () => {
  const { turfId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getTurfsReviewAdmin(turfId!, page, 10);
      setReviews(res.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const confirmDelete = async () => {
  if (!selectedReviewId) return

  setDeleteLoading(true)
  try {
    await adminService.deleteReviewAdmin(selectedReviewId)
    await fetchReviews()
  } catch (error) {
    console.error("Failed to delete review:", error)
  } finally {
    setDeleteLoading(false)
    setShowDeleteModal(false)
    setSelectedReviewId(null)
  }
}
const openDeleteModal = (reviewId: string) => {
  setSelectedReviewId(reviewId)
  setShowDeleteModal(true)
}


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Turf Reviews</h1>
          </div>
          <p className="text-slate-400 ml-14">
            Manage and moderate user reviews for this turf
          </p>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-sm">
            <div className="inline-flex p-4 bg-slate-800/50 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No reviews yet
            </h3>
            <p className="text-slate-500">
              This turf hasn't received any reviews from users.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:bg-slate-900/70 hover:border-slate-700 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-slate-800/80 rounded-lg">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {review.userName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-sm text-slate-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-slate-300 leading-relaxed ml-14">
                      {review.comment}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => openDeleteModal(review._id)}

                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40 group-hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {reviews.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 hover:bg-slate-800/70 disabled:bg-slate-900/30 text-white disabled:text-slate-600 rounded-lg transition-all duration-200 border border-slate-800 disabled:border-slate-800/50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Previous</span>
            </button>

            <div className="px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 font-semibold">
              Page {page}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={reviews.length < 10}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 hover:bg-slate-800/70 disabled:bg-slate-900/30 text-white disabled:text-slate-600 rounded-lg transition-all duration-200 border border-slate-800 disabled:border-slate-800/50 disabled:cursor-not-allowed"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        <ConfirmationModal
  isOpen={showDeleteModal}
  onClose={() => {
    if (!deleteLoading) {
      setShowDeleteModal(false)
      setSelectedReviewId(null)
    }
  }}
  onConfirm={confirmDelete}
  title="Delete Review"
  message="Are you sure you want to permanently delete this review? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  loading={deleteLoading}
/>

      </div>
    </div>
  );
};

export default AdminTurfReviews;
