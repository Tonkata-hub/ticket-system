"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function TableHeader({ sortConfig, onSort }) {
	const getSortDirectionIcon = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "ascending" ? (
			<ChevronUp className="h-4 w-4" />
		) : (
			<ChevronDown className="h-4 w-4" />
		);
	};

	const columns = [
		{ key: "uid", label: "ID" },
		{ key: "selectedEvent", label: "Event" },
		{ key: "statusBadge", label: "Status" },
		{ key: "priority", label: "Priority" },
		{ key: "createdBy", label: "Created By" },
		{ key: "createdAt", label: "Created At" },
		{ key: "updatedAt", label: "Updated At" },
		{ key: "clientNote", label: "Client Note" },
		{ key: "issueType", label: "Issue Type" },
		{ key: "currentCondition", label: "Current Condition" },
		{ key: "assignee", label: "Assignee" },
		{ key: "communicationChannel", label: "Communication Channel" },
		{ key: "dateOfStartingWork", label: "Date of Starting Work" },
		{ key: "currentConditionByAdmin", label: "Condition by Admin" },
		{ key: "problemSolvedAt", label: "Solved At" },
		{ key: "actionTaken", label: "Action Taken" },
		{ key: "timeTakenToSolve", label: "Time to Solve" },
	];

	return (
		<thead>
			<tr className="bg-muted/50">
				{columns.map((column) => (
					<th
						key={column.key}
						className="px-4 py-3 text-left font-medium text-muted-foreground sticky top-0 z-10 bg-background"
					>
						<button
							className="flex items-center gap-1 hover:text-foreground"
							onClick={() => onSort(column.key)}
						>
							{column.label} {getSortDirectionIcon(column.key)}
						</button>
					</th>
				))}
			</tr>
		</thead>
	);
}
