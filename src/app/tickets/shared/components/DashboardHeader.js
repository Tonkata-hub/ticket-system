"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TableIcon, LayoutGridIcon } from "lucide-react";
import RefreshButton from "./RefreshButton";
import AdminBadge from "./AdminBadge";
import { useI18n } from "@/context/I18nContext";

export default function DashboardHeader({ isAdmin, loading, onRefresh, viewMode, onToggleView }) {
	const { t } = useI18n();
	return (
		<div className="flex justify-between items-center mb-8">
			<div className="flex items-center">
				<motion.h1
					className="text-3xl font-bold text-blue-800"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{t("tickets.dashboardTitle")}
				</motion.h1>
				{isAdmin && <AdminBadge className="ml-3" />}
			</div>

			<div className="flex items-center space-x-2">
				<RefreshButton onRefresh={onRefresh} disabled={loading} />
				<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
					<Button
						variant="outline"
						size="sm"
						onClick={onToggleView}
						className="flex items-center gap-2 bg-transparent"
					>
						{viewMode === "card" ? (
							<>
								<TableIcon className="h-4 w-4" />
								<span>{t("tickets.tableView")}</span>
							</>
						) : (
							<>
								<LayoutGridIcon className="h-4 w-4" />
								<span>{t("tickets.cardView")}</span>
							</>
						)}
					</Button>
				</motion.div>
			</div>
		</div>
	);
}
