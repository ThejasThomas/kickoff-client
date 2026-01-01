import { adminService } from "@/services/admin/adminService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2, MessageSquare } from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModel";
interface Review {
  _id: string;
  comment: string;
  userName: string;
  createdAt: string;
}

const AdminTurfReviews = () => {
  const { turfId } = useParams<{ turfId: string }>();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // confirmation modal states
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  // const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    if (!turfId) return;

    setLoading(true);
    try {
      const res = await adminService.getTurfsReviewAdmin(turfId, page, 10);
      setReviews(res.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, turfId]);

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;

    try {
      // setIsDeleting(true);
      await adminService.deleteReviewAdmin(selectedReview._id);
      setSelectedReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      // setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Turf Reviews Management
          </h2>
          <p className="text-sm text-gray-600">
            Moderate and remove inappropriate reviews
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-800">
            {reviews.length}
          </span>
          <span className="text-gray-500 text-sm">Reviews</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading reviews...
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">
            No reviews found for this turf
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">
                  {review.userName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedReview(review)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            <p className="mt-3 text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-white border rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to permanently remove this review? This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminTurfReviews;
