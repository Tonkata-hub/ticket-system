"use client";

import { useMemo } from "react";

export function useTablePagination(items, currentPage, itemsPerPage) {
	const totalPages = Math.ceil(items.length / itemsPerPage);

	const paginatedItems = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return items.slice(startIndex, startIndex + itemsPerPage);
	}, [items, currentPage, itemsPerPage]);

	return {
		paginatedItems,
		totalPages,
	};
}

export function usePaginationHandlers(setCurrentPage, setItemsPerPage, totalPages) {
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	};

	return {
		handlePageChange,
		handleItemsPerPageChange,
	};
}
