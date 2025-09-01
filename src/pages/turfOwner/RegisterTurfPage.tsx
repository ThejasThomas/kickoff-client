
import type React from "react"
import { useAddTurfMutation } from "@/hooks/turfOwner/addTurf"
import type { ITurfResponse } from "@/types/Response"
import AddTurfPage from "@/components/ReusableComponents/AddTurfComponent"
import type { NewTurf } from "@/types/Turf"

const AddTurfPageContainer: React.FC = () => {
  const { mutate: addTurf, isPending } = useAddTurfMutation()

  const handleSubmit = async (turfData: NewTurf) => {
    console.log('statussssssss',turfData.status)
    addTurf(turfData, {
      onSuccess: (response: ITurfResponse) => {
        if (response.success) {
          alert("Turf registered successfully!")
          // Optionally navigate back or to dashboard
          // window.history.back()
        } else {
          alert(response.message || "Failed to register turf. Please try again.")
        }
      },
      onError: (error: any) => {
        if (error?.response?.status === 400) {
          alert("Invalid data provided. Please check your inputs.")
        } else if (error?.response?.status === 401) {
          alert("Please login to continue.")
        } else if (error?.response?.status === 500) {
          alert("Server error. Please try again later.")
        } else {
          alert("Failed to register turf. Please check your connection and try again.")
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
