import type { JSX } from "react";
import { useSelector } from "react-redux";
import { getActiveSession } from "../helpers/getActiveSession";
import { Navigate } from "react-router-dom";

interface protectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute = ({
  element,
  allowedRoles,
}: protectedRouteProps) => {
  const session = useSelector(getActiveSession);

  if (!session) {
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (
    !allowedRoles
      .map((r) => r.toLowerCase())
      .includes((session.role || "").toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};
