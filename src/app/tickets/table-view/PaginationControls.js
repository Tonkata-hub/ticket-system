"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PaginationControls({
	currentPage,
	totalPages,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
}) {
	return (
		<div className="flex items-center justify-between my-4">
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">Rows per page:</span>
				<Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
					<SelectTrigger className="w-[80px] h-8">
						<SelectValue placeholder="50" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="20">20</SelectItem>
						<SelectItem value="50">50</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-1">
				<span className="text-sm text-muted-foreground mr-2">
					Page {currentPage} of {totalPages}
				</span>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-transparent"
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
					<ChevronLeft className="h-4 w-4 -ml-2" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-transparent"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-transparent"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 bg-transparent"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
					<ChevronRight className="h-4 w-4 -ml-2" />
				</Button>
			</div>
		</div>
	);
}
