
import type React from "react"
import { useAddTurfMutation } from "@/hooks/turfOwner/addTurf"
import type { ITurfResponse } from "@/types/Response"
import AddTurfPage from "@/components/ReusableComponents/AddTurfComponent"
import type { NewTurf } from "@/types/Turf"
import { useToaster } from "@/hooks/ui/useToaster"

const AddTurfPageContainer: React.FC = () => {
  const { mutate: addTurf, isPending } = useAddTurfMutation()
  const {successToast,errorToast} =useToaster()

  const handleSubmit = async (turfData: NewTurf) => {
    console.log('statussssssss',turfData.status)
    addTurf(turfData, {
      onSuccess: (response: ITurfResponse) => {
        if (response.success) {
          successToast("Turf registered successfully!")
        } else {
          successToast(response.message || "Failed to register turf. Please try again.")
        }
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";

        if (error?.response?.status === 400) {
          errorToast(errorMessage || "Invalid data provided. Please check your inputs.");
        } else if (error?.response?.status === 401) {
          errorToast(errorMessage || "Please login to continue.");
        } else if (error?.response?.status === 500) {
          errorToast(errorMessage || "Server error. Please try again later.");
        } else {
          errorToast(errorMessage || "Failed to register turf. Please check your connection and try again.");
        }
      },
    })
  }

  return (
    <div className={isPending ? "opacity-80 pointer-events-none" : ""}>
      <AddTurfPage
        onSubmit={handleSubmit}
        onCancel={() => {
          if (typeof window !== "undefined") window.history.back()
        }}
      />
    </div>
  )
}

export default AddTurfPageContainer
