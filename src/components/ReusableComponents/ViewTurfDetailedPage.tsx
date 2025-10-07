import React from 'react';
import { MapPin, Phone, Clock, Users } from 'lucide-react';
import type { ITurf } from '@/types/Turf';

interface TurfDetailsProps {
  turf: ITurf;
  onClose?: () => void; 
}

const TurfDetails: React.FC<TurfDetailsProps> = ({ turf, onClose }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blocked: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{turf.turfName}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(turf.status)}`}>
          {turf.status.charAt(0).toUpperCase() + turf.status.slice(1)}
        </span>
      </div>

      {/* Image */}
      <div className="mb-6">
        {turf.images && turf.images.length > 0 ? (
          <img
            src={turf.images[0]}
            alt={turf.turfName}
            className="w-full h-64 object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
            <Users className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4">
        <p className="text-gray-600">{turf.description}</p>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{turf.location.address}, {turf.location.city}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{turf.contactNumber}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">{turf.courtType}</span>
          <div className="flex items-center text-green-600 font-semibold">
            <Clock className="w-5 h-5 mr-1" />
            ₹{turf.pricePerHour}/hr
          </div>
        </div>
      </div>

      {/* Actions */}
      {onClose && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TurfDetails;