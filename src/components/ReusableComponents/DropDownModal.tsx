import { createPortal } from "react-dom";

export const DropdownPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};
