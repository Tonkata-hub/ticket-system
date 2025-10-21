"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function PrioritySelect({ value, options, error, onChange, triggerRef, onEnter, disabled = false }) {
	const { t } = useI18n();
	return (
		<div className="space-y-2">
			<label className="text-md font-medium text-gray-700">
				{t("home.priority")} <span className="text-red-500 text-sm font-bold ml-1">*</span>
			</label>
			<Select onValueChange={onChange} disabled={disabled}>
				<SelectTrigger
					className={`w-full ${error ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
					ref={triggerRef}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							onEnter?.();
						}
					}}
				>
					<SelectValue placeholder={t("home.select", { label: t("home.priority").toLowerCase() })}>
						<span>{value ? options.find((p) => p.value === value)?.text : null}</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<div className="flex items-center gap-2">
								<span>{option.text}</span>
								{option.description && value !== option.value && (
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className="relative group flex items-center justify-center"
												tabIndex={-1}
											>
												<Info className="h-[16px] w-[16px] text-blue-400 group-hover:text-blue-600 transition-colors duration-200 ease-in-out" />
											</div>
										</TooltipTrigger>
										<TooltipContent
											side="right"
											className="max-w-[200px] bg-white text-sm text-gray-700 border shadow-md rounded-md px-3 py-2"
										>
											{option.description}
										</TooltipContent>
									</Tooltip>
								)}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
