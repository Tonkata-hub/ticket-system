"use client";

import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChangeIndicator } from "./ChangeIndicator";
import { safeValue } from "../utils/ticketModalConstants";

export function CommentsSection({ editMode, comments, changedFields, onCommentChange, onAddComment, onRemoveComment }) {
	return (
		<div className="space-y-4">
			<div>
				<div className="flex items-center mb-2">
					<h3 className="text-lg font-semibold text-blue-800">Comments</h3>
					{editMode && changedFields.comments && (
						<ChangeIndicator show={changedFields.comments} editMode={editMode} />
					)}
				</div>
				{comments && comments.length > 0 ? (
					<motion.ul className="space-y-2">
						{comments.map((comment, index) => (
							<motion.li
								key={index}
								className="bg-gray-50 p-3 rounded relative"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									type: "spring",
								}}
							>
								{editMode && (
									<Button
										variant="ghost"
										size="sm"
										className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => onRemoveComment(index)}
									>
										<Trash className="h-4 w-4" />
									</Button>
								)}
								{editMode ? (
									<Textarea
										value={safeValue(comment.content)}
										onChange={(e) => onCommentChange(index, e.target.value)}
										className="mb-2"
									/>
								) : (
									<p className="text-sm text-gray-600">{comment.content}</p>
								)}
								<span className="text-xs text-gray-400">
									Posted by {comment.author} on {comment.timestamp}
								</span>
							</motion.li>
						))}
					</motion.ul>
				) : (
					<p className="text-gray-500">No comments yet.</p>
				)}
				{editMode && (
					<Button onClick={onAddComment} variant="outline" size="sm" className="mt-2 bg-transparent">
						<Plus className="mr-2 h-4 w-4" />
						Add Comment
					</Button>
				)}
			</div>
		</div>
	);
}
