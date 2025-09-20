import { useState } from "react";

type FormData = {
  upiId?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  selectedWallet?: string;
  stripeCardNumber?: string;
  stripeExpiryDate?: string;
  stripeCvc?: string;
  stripeCardholderName?: string;
};

const [formData, setFormData] = useState<FormData>({});
