import { useState } from "react";
const [formData, setFormData] = useState<FormData>({});


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

console.log(formData)
console.log(setFormData)