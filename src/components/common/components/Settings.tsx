import { ConfirmationModal } from "@/components/modals/confirmationModal";
import { Button } from "@/components/ui/button";
import type { UserRoles } from "@/types/UserRoles";
import { CardContent } from "@mui/material";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface SettingsProps {
  userRole?: UserRoles;

  onLogout?: () => void;
}

export function Settings({
  userRole = "client",

  onLogout = () => {},
}: SettingsProps) {
  const navigate = useNavigate();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    onLogout();

    setTimeout(() => {
      setConfirmLogout(false);
      navigate("/");
    }, 500);
  };

  return (
    <div>
      <div>
        <Button>
          <ArrowLeft />
          <span>Go Back</span>
        </Button>
      </div>

      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          <>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Logout</span>
                <p className="text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setConfirmLogout(true)}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            <Separator className="bg-gray-200" />
          </>
        </div>
      </CardContent>

      <ConfirmationModal
        isOpen={confirmLogout}
        title="Are you sure want to logout?"
        description="You will be logged out of your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onClose={() => setConfirmLogout(false)}
      />
    </div>
  );
}
