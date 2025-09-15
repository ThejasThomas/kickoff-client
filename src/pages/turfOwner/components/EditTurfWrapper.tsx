import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { NewTurf } from '@/types/Turf';
import EditTurfPage from '@/components/ReusableComponents/EditTurfComponent';
import { useGetTurfById } from '@/hooks/turfOwner/getTurfById';
import { useUpdateTurf } from '@/hooks/turfOwner/updateTurf';

export const EditTurfWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: turf, isLoading, error } = useGetTurfById(id!);
  const { mutate: updateTurf, isPending: isUpdating } = useUpdateTurf();

  const handleSubmit = (data: NewTurf) => {
    if (!id) return;
    updateTurf(
      { id, data },
      {
        onSuccess: () => {
          navigate('/turfOwner/my-turf');
        },
        onError: (err: Error) => {
          console.error('Update failed:', err);
          alert('Failed to update turf');
        },
      }
    );
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-lg">Loading turf details...</div>
  //     </div>
  //   );
  // }

  if (error || !turf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">Failed to load turf details</p>
          <button
            onClick={() => navigate('/turfOwner/my-turf')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <EditTurfPage
      turf={turf}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/turfOwner/my-turf')}
    />
  );
};