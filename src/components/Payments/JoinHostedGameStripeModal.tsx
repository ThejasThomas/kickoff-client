import { useEffect } from "react";

interface JoinGameStripeModalProps {
  amount: number;
  gameId: string;
  onError?: (err: any) => void;
}

const JoinGameStripeModal: React.FC<JoinGameStripeModalProps> = ({
  amount,
  gameId,
  onError,
}) => {
  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_PRIVATE_API_URL}/api/payment/create-join-hosted-game-session`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameId,
            amount,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Checkout failed: ${errText}`);
        }

        const session = await response.json();

        if (session.url) {
          window.location.href = session.url;
        } else {
          throw new Error("No checkout URL received");
        }
      } catch (err) {
        onError?.(err);
      }
    };

    createCheckoutSession();
  }, [amount, gameId, onError]);

  return null;
};

export default JoinGameStripeModal;
