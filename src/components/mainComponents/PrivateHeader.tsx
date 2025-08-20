import type { UserDTO } from "@/types/User";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    user: UserDTO | null;
    onSidebarToggle?: () => void;
    onLogout: () => void;
    className?: string;
}

export function PrivateHeader({
    user,
    onSidebarToggle,
    onLogout,
    className,
}: HeaderProps) {
    const navigate = useNavigate();

    const isClient = user?.role === 'client';
    const isTurfOwner = user?.role === 'turfOwner';

    return (
        <header className={className}>
            <div>
                <button onClick={onSidebarToggle}>Toggle Sidebar</button>
            </div>

            <div>
                <img src="/default-profile.png" alt="User" />
            </div>

            <div>
                <p>Right Section</p>
                {/* <p>User Info: {user?.fullName} ({user?.role})</p> */}
                {/* <button onClick={onLogout}>Logout</button> */}
            </div>
        </header>
    );
}
