import { useEffect, useState } from "react";
import { Search, MapPin, DollarSign, Users, Clock } from "lucide-react";
import { getTurfs } from "@/services/client/clientService";
import type { ITurf } from "@/types/Turf";
import type { TurfsResponse } from "@/types/Response";
import { useNavigate } from "react-router-dom";

const AdminTurfsForReview = () => {
  const [turfs, setTurfs] = useState<ITurf[]>([]);
  const [filteredTurfs, setFilteredTurfs] = useState<ITurf[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTurfs();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTurfs(turfs);
    } else {
      const filtered = turfs.filter(
        (turf) =>
          turf.turfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          turf.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          turf.location.state?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTurfs(filtered);
    }
  }, [searchQuery, turfs]);

  const LIMIT = 5;

  const fetchTurfs = async () => {
    try {
      setLoading(true);

      const response: TurfsResponse = await getTurfs({
        page: currentPage,
        limit: LIMIT,
      });

      if (!response.success) {
        console.error("Failed to fetch turfs");
        return;
      }

      setTurfs(response.turfs || []);
      setFilteredTurfs(response.turfs || []);
      setTotalPages(response.totalPages || 1); // ✅ IMPORTANT
    } catch (error) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
      case "blocked":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleManageReviews = (turfId: string) => {
    navigate(`/admin/review-management/${turfId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading turfs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Review Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage turf reviews and monitor feedback
              </p>
            </div>
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Total Turfs</p>
              <p className="text-3xl font-bold text-indigo-600">
                {filteredTurfs.length}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by turf name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Turfs Grid */}
        {filteredTurfs.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No turfs found
            </h3>
            <p className="text-slate-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTurfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                  {turf.images && turf.images.length > 0 ? (
                    <img
                      src={turf.images[0] || "/placeholder.svg"}
                      alt={turf.turfName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-16 h-16 text-slate-400" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        turf.status
                      )} backdrop-blur-sm`}
                    >
                      {turf.status.charAt(0).toUpperCase() +
                        turf.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
                    {turf.turfName}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {turf.description}
                  </p>

                  {/* Details Grid */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 line-clamp-2">
                        {turf.location.city}
                        {turf.location.state && `, ${turf.location.state}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-700 font-semibold">
                          ₹{turf.pricePerHour}/hr
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-700 font-medium">
                          {turf.courtType}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {turf.amenities && turf.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {turf.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                        {turf.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                            +{turf.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleManageReviews(turf._id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Manage Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTurfsForReview;
