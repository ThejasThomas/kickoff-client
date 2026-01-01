import React, { useEffect } from "react";

interface StripeModalProps {
  amount: number;
  bookingData: any;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

const StripeModal: React.FC<StripeModalProps> = ({
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
        console.log('heyloo this is checkout')
        const apiUrl = `${import.meta.env.VITE_PRIVATE_API_URL}/api/payment/create-checkout-session`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount, bookingData }),
        });


        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Failed to create session: ${response.status} - ${errText}`);
        }

        const session = await response.json();

        if (session.url) {
          window.location.href = session.url;
        } else {
          throw new Error("No checkout URL in response");
        }
      } catch (err) {
        onError?.(err);
      }
    };

    createCheckoutSession();

    return () => {
    };
  }, [amount, bookingData, onError]);

  return null;
};

export default StripeModal;
