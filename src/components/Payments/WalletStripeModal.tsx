import { useEffect } from "react";

interface WalletStripeModalProps {
  amount: number;
  onError?: (err: any) => void;
}

const WalletStripeModal: React.FC<WalletStripeModalProps> = ({ amount, onError }) => {
  useEffect(() => {
    const createWalletSession = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_PRIVATE_API_URL}/api/payment/create-wallet-session`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        });

        const data = await res.json();

        if (!data.url) throw new Error("Stripe URL missing");

        window.location.href = data.url;
      } catch (err) {
        onError?.(err);
      }
    };

    createWalletSession();
  }, [amount, onError]);

  return null;
};

export default WalletStripeModal;
