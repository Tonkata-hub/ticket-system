"use client";

import { useMemo } from "react";

export function useTableSort(items, sortConfig) {
	return useMemo(() => {
		const sortableItems = [...items];
		if (sortConfig.key) {
			sortableItems.sort((a, b) => {
				let aValue = a[sortConfig.key];
				let bValue = b[sortConfig.key];

				// Handle dates
				if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
					aValue = new Date(aValue).getTime();
					bValue = new Date(bValue).getTime();
				}

				// Handle strings
				if (typeof aValue === "string" && typeof bValue === "string") {
					aValue = aValue.toLowerCase();
					bValue = bValue.toLowerCase();
				}

				if (aValue < bValue) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [items, sortConfig]);
}

export function useSortHandler(sortConfig, setSortConfig) {
	const requestSort = (key) => {
		let direction = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	return requestSort;
}
