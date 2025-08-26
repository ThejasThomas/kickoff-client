import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => void;
  isSending: boolean;
}

export default function OTPModal({
  isOpen,
  onClose,
  onVerify,
  onResend,
  isSending,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setTimer(60);
      setIsTimerRunning(true);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleVerify = () => {
    setIsVerifying(true);
    setError("");
    try {
      onVerify(otp);
    } catch {
      setError("OTP verification failed. Please try again.");
      setOtp("");
    }
    setIsVerifying(false);
  };

  const handleResend = () => {
    setOtp("");
    setError("");
    onResend();
    setTimer(60);
    setIsTimerRunning(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-50 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Verification Code
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            We sent a verification code to your email. Please enter it below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6 px-4">
          <InputOTP maxLength={4} value={otp} onChange={setOtp}>
            <InputOTPGroup className="gap-3">
              {[...Array(4)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-14 h-14 text-center text-xl bg-gray-50 border-2 border-gray-300 rounded-md focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-600 font-medium text-sm animate-pulse">
              {error}
            </p>
          )}

          <div className="text-sm text-center text-gray-700">
            Didn't receive the code?{" "}
            {isTimerRunning ? (
              <span className="text-yellow-500 font-semibold">
                Resend available in {timer}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isSending}
                className="text-yellow-500 font-semibold hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSending ? "Sending..." : "Resend"}
              </button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.length !== 4 || isVerifying}
            className="w-full border-2 border-black text-black bg-transparent hover:bg-yellow-400 hover:text-black transition-colors duration-300 font-semibold rounded-md"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </DialogContent>

      {/* Dark overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
      )}
    </Dialog>
  );
}
