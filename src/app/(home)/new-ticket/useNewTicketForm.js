"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/context/I18nContext";

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
				const res = await fetch("/api/ticket-options");
				const data = await res.json();
				if (isMounted) setTicketOptions(data);
			} catch (e) {
				// Show a toast but avoid crashing the UI
				toast.error(t("home.loadOptionsError"));
			}
		};
		loadOptions();
		return () => {
			isMounted = false;
		};
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
			const ticketData = {
				issueType: formData.issueType === "other" ? formData.otherIssue : formData.issueType,
				condition: formData.condition === "other" ? formData.otherCondition : formData.condition,
				priority: formData.priority,
				event: formData.event,
				clientNote: formData.clientNote || "",
				shortDescription: formData.shortDescription,
			};

			const response = await fetch("/api/createTicket", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(ticketData),
			});

			const result = await response.json();

			if (!response.ok) {
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
			setFormKey((prev) => prev + 1);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error submitting ticket:", error);
			setSubmissionError(error.message);
			toast.error(t("home.createFailed", { message: error.message }));
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		formKey,
		formData,
		errors,
		isSubmitting,
		submissionError,
		ticketOptions,
		handleChange,
		handleSubmit,
	};
}
