import type { IHostGameCheckoutData } from "@/types/hostGameProps";
import React, { useEffect } from "react";

interface HostGameStripeModalProps {
  amount: number;
  bookingData: IHostGameCheckoutData;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

const HostGameStripeModal: React.FC<HostGameStripeModalProps> = ({
  amount,
  bookingData,
  onError,
}) => {

  useEffect(() => {
    if (!import.meta.env.VITE_PRIVATE_API_URL) {
      onError?.(new Error("Missing API URL config"));
      return;
    }

    const createCheckoutSession = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_PRIVATE_API_URL}/api/payment/create-host-session`;

        const payload = {
          amount,
          ...bookingData,
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Failed to create hosted game session");
        }

        const session = await response.json();

        if (session.url) {
          window.location.href = session.url;
        } else {
          throw new Error("Stripe session URL missing");
        }
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error("Unknown error"));
      }
    };

    createCheckoutSession();
  }, [amount, bookingData, onError]);

  return null;
};

export default HostGameStripeModal;
