export const statusColor = {
	Open: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
	"In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
	Urgent: "bg-red-100 text-red-800 hover:bg-red-200",
	Closed: "bg-green-100 text-green-800 hover:bg-green-200",
};

export const priorityColor = {
	High: "bg-red-100 text-red-800 hover:bg-red-200",
	Medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
	Low: "bg-green-100 text-green-800 hover:bg-green-200",
};

export function formatDate(isoDate) {
	const date = new Date(isoDate);
	return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
