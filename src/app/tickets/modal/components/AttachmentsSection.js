import { Paperclip } from "lucide-react";

export function AttachmentsSection({ attachments }) {
	return (
		<div className="mb-6">
			<h3 className="text-sm font-semibold text-gray-500 mb-2">Attachments</h3>
			{attachments && attachments.length > 0 ? (
				<ul className="list-disc list-inside">
					{attachments.map((attachment) => (
						<li key={attachment} className="text-blue-600 hover:underline">
							<Paperclip className="inline-block mr-1 h-4 w-4" />
							{attachment}
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No attachments</p>
			)}
		</div>
	);
}
