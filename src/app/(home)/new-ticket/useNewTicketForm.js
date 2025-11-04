"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/context/I18nContext";
import { createTicket, getTicketOptions } from "@/lib/actions/ticketActions";

export function useNewTicketForm({ isLoggedIn }) {
	const { t } = useI18n();
	const [formKey, setFormKey] = useState(0);
	const [formData, setFormData] = useState({
		issueType: "",
		condition: "",
		priority: "",
		event: "",
		otherIssue: "",
		otherCondition: "",
		clientNote: "",
		shortDescription: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState(null);
	const [files, setFiles] = useState([]);
	const [isUploading, setIsUploading] = useState(false);

	// Helper function to clear files with cleanup
	const clearFiles = () => {
		files.forEach((fileData) => {
			URL.revokeObjectURL(fileData.preview);
		});
		setFiles([]);
	};

	const [ticketOptions, setTicketOptions] = useState({
		issueType: [],
		condition: [],
		priority: [],
		event: [],
	});

	useEffect(() => {
		let isMounted = true;
		const loadOptions = async () => {
			try {
				const result = await getTicketOptions();
				if (isMounted && result.success) {
					setTicketOptions(result.options);
				} else if (isMounted) {
					toast.error(t("home.loadOptionsError"));
				}
			} catch (e) {
				// Show a toast but avoid crashing the UI
				if (isMounted) {
					toast.error(t("home.loadOptionsError"));
				}
			}
		};
		loadOptions();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: false,
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {
			priority: !formData.priority,
			shortDescription: !formData.shortDescription,
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some(Boolean);
	};

	const handleSubmit = async () => {
		if (!isLoggedIn) {
			toast.error(t("home.mustLoginToast"));
			return;
		}

		if (!validateForm()) {
			toast.error(t("home.completeRequiredToast"));
			return;
		}

		setIsSubmitting(true);
		setSubmissionError(null);

		try {
			// Upload files if any
			let uploadedFilenames = [];
			if (files.length > 0) {
				setIsUploading(true);
				const formData = new FormData();
				files.forEach((file) => {
					formData.append("files", file.file);
				});

				const uploadResponse = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const uploadResult = await uploadResponse.json();

				if (!uploadResponse.ok || !uploadResult.success) {
					throw new Error(uploadResult.error || "Failed to upload files");
				}

				uploadedFilenames = uploadResult.files;
			}

			const ticketData = {
				issueType: formData.issueType === "other" ? formData.otherIssue : formData.issueType,
				condition: formData.condition === "other" ? formData.otherCondition : formData.condition,
				priority: formData.priority,
				event: formData.event,
				clientNote: formData.clientNote || "",
				shortDescription: formData.shortDescription,
				attachments: uploadedFilenames,
			};

			const result = await createTicket(ticketData);

			if (!result.success) {
				throw new Error(result.error || "Failed to create ticket");
			}

			toast.success(t("home.createdSuccess", { uid: result.ticket.uid }));

			setFormData({
				issueType: "",
				condition: "",
				priority: "",
				event: "",
				otherIssue: "",
				otherCondition: "",
				clientNote: "",
				shortDescription: "",
			});
			clearFiles();
			setFormKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error submitting ticket:", error);
			setSubmissionError(error.message);
			toast.error(t("home.createFailed", { message: error.message }));
		} finally {
			setIsSubmitting(false);
			setIsUploading(false);
		}
	};

	return {
		formKey,
		formData,
		errors,
		isSubmitting,
		isUploading,
		submissionError,
		ticketOptions,
		files,
		setFiles,
		handleChange,
		handleSubmit,
	};
}
