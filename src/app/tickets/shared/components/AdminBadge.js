"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminBadge({ className = "" }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<motion.div
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ${className}`}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "spring", stiffness: 500, damping: 20 }}
						whileHover={{ scale: 1.05 }}
					>
						<ShieldCheck className="w-3.5 h-3.5 mr-1" />
						Admin
					</motion.div>
				</TooltipTrigger>
				<TooltipContent>
					<p>You have administrative privileges</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
