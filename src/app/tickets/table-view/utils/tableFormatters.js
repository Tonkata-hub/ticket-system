export function formatDate(isoDate) {
	const date = new Date(isoDate);
	return (
		date.toLocaleDateString() +
		" " +
		date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
	);
}

export function formatOptionalDate(isoDate) {
	if (!isoDate) return "";
	try {
		return formatDate(isoDate);
	} catch (_e) {
		return "";
	}
}

export function truncateText(value, limit = 50) {
	if (value === null || value === undefined) return "";
	const str = String(value);
	if (str.length <= limit) return str;
	return str.slice(0, limit) + "...";
}
