import { useState } from "react";
import navConfig from "../../config/SideBar_config"; // ✅ Renamed to avoid conflict
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // if you're using a `cn` utility (Tailwind merge), or remove this line

interface SidebarProps {
	isVisible: boolean;
	onClose: () => void;
	handleLogout?: () => void;
	className?: string;
	role: "admin" | "client" | "turfOwner";
}

interface NavItemProps {
	item: {
		title: string;
		icon: React.ElementType;
		path: string;
	};
	isActive: boolean;
	onClick: () => void;
}

const SidebarItem = ({ item, isActive, onClick }: NavItemProps) => {
	const Icon = item.icon;

	return (
		<Link
			to={item.path}
			className={cn(
				"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
				isActive
					? "bg-[var(--yellow)] text-black font-medium"
					: "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
			)}
			onClick={onClick}
		>
			<Icon className="h-5 w-5" />
			<span>{item.title}</span>
		</Link>
	);
};

export function Sidebar({
	isVisible,
	onClose,
	handleLogout,
	className,
	role,
}: SidebarProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	const navItems =
		navConfig[role] as {
			title: string;
			path: string;
			icon: React.ElementType;
		}[] || [];

	return (
		<>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>
				)}
			</AnimatePresence>

			<nav className={`flex-1 mt-1 px-3 overflow-y-auto ${className || ""}`}>
				<div className="space-y-1 py-2">
					{navItems.map((item, index) => (
						<SidebarItem
							key={index}
							item={item}
							isActive={index === activeIndex}
							onClick={() => {
								setActiveIndex(index);
								onClose();
							}}
						/>
					))}
				</div>
			</nav>
		</>
	);
}
