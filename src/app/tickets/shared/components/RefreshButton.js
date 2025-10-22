"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RefreshButton({ onRefresh, disabled = false }) {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [iconColor, setIconColor] = useState("#000000"); // default color (black)

	// Array of colors (Tailwind colors in hex format)
	const colors = [
		"#FF5733", // vivid orange-red
		"#33FFCE", // turquoise
		"#FF33F6", // hot pink
		"#337BFF", // blue
		"#8D33FF", // purple
		"#33FF57", // bright green
		"#FFC300", // yellow
		"#E91E63", // deep pink
		"#9C27B0", // deep purple
		"#4CAF50", // green
		"#03A9F4", // light blue
		"#FF9800", // orange
	];

	const handleRefresh = async () => {
		if (isRefreshing || disabled) return;

		// Pick a random color from the array
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		setIconColor(randomColor);

		setIsRefreshing(true);
		await onRefresh();
		setIsRefreshing(false);
	};

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			disabled={disabled || isRefreshing}
			onClick={handleRefresh}
			className="relative inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<motion.div
				animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
				transition={{
					duration: 1,
					repeat: isRefreshing ? Infinity : 0,
					ease: "linear",
				}}
			>
				<RefreshCw style={{ color: iconColor }} className="h-4 w-4" />
			</motion.div>
			<span className="ml-2">Refresh</span>
		</motion.button>
	);
}
