import { Paperclip } from "lucide-react";

export function AttachmentsSection({ attachments }) {
	return (
		<div className="mb-6">
			<h3 className="text-sm font-semibold text-gray-500 mb-2">Attachments</h3>
			{attachments && attachments.length > 0 ? (
				<ul className="list-none">
					{attachments.map((attachment) => (
						<li key={attachment}>
							<a
								href={`/api/uploads/${attachment}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-blue-600 hover:underline"
							>
								<Paperclip className="inline-block h-4 w-4" />
								{attachment}
							</a>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No attachments</p>
			)}
		</div>
	);
}
