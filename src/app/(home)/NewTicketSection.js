"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { formVariants, itemVariants, titleVariants, buttonVariants } from "./new-ticket/variants";
import { useNewTicketForm } from "./new-ticket/useNewTicketForm";
import PrioritySelect from "./new-ticket/PrioritySelect";
import OptionSelect from "./new-ticket/OptionSelect";
import { useI18n } from "@/context/I18nContext";

// Animation variants moved to ./new-ticket/variants

export default function NewTicketSection() {
	const { isLoggedIn } = useAuth();
	const { t } = useI18n();

	const shortDescriptionRef = useRef(null);
	const priorityTriggerRef = useRef(null);
	const issueTypeTriggerRef = useRef(null);
	const conditionTriggerRef = useRef(null);
	const eventTriggerRef = useRef(null);
	const submitButtonRef = useRef(null);
	const filesRef = useRef([]);
	const fileInputRef = useRef(null);

	const { formKey, formData, errors, isSubmitting, isUploading, submissionError, ticketOptions, files, setFiles, handleChange, handleSubmit } =
		useNewTicketForm({ isLoggedIn });

	useEffect(() => {
		shortDescriptionRef.current?.focus();
	}, []);

	// Keep filesRef in sync with files
	useEffect(() => {
		filesRef.current = files;
	}, [files]);

	// Cleanup object URLs when component unmounts
	useEffect(() => {
		return () => {
			filesRef.current.forEach((fileData) => {
				URL.revokeObjectURL(fileData.preview);
			});
		};
	}, []);

	const handleFileSelect = (e) => {
		const selectedFiles = Array.from(e.target.files);
		
		// Validate files
		const validFiles = selectedFiles.filter((file) => {
			// Check file type
			const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
			if (!validTypes.includes(file.type)) {
				toast.error(`${file.name} is not a valid image type. Only PNG, JPG, JPEG, GIF, and WEBP are allowed.`);
				return false;
			}
			
			// Check file size (5MB)
			const maxSize = 5 * 1024 * 1024;
			if (file.size > maxSize) {
				toast.error(`${file.name} is too large. Maximum size is 5MB.`);
				return false;
			}
			
			return true;
		});

		// Check if adding these files would exceed the limit
		if (files.length + validFiles.length > 5) {
			toast.error("Maximum 5 files allowed");
			return;
		}

		// Add files to state
		const newFiles = validFiles.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
			id: Date.now() + Math.random(),
		}));

		setFiles([...files, ...newFiles]);
	};

	const handleRemoveFile = (id) => {
		const fileToRemove = files.find((f) => f.id === id);
		if (fileToRemove) {
			URL.revokeObjectURL(fileToRemove.preview);
		}
		setFiles(files.filter((f) => f.id !== id));
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
	};

	return (
		<section className="w-full py-12 md:py-20 lg:py-26 flex justify-center bg-blue-50">
			<div className="container px-4 md:px-6">
				<AnimatePresence>
					{typeof isLoggedIn === "boolean" &&
						(isLoggedIn ? (
							<motion.h1
								className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900"
								variants={titleVariants}
								initial="hidden"
								animate="visible"
							>
								{t("home.submitNewTicket")}
							</motion.h1>
						) : (
							<>
								<motion.h1
									className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900"
									variants={titleVariants}
									initial="hidden"
									animate="visible"
								>
									{t("home.submitTicket")}
								</motion.h1>
								<motion.p
									className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
								>
									{t("home.helpText")}
								</motion.p>
							</>
						))}
				</AnimatePresence>

				<motion.div variants={formVariants} initial="hidden" animate="visible">
					<Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
						<ToastContainer position="top-center" autoClose={3000} />

						<CardHeader className="bg-blue-100 border-b border-blue-100">
							<motion.div variants={itemVariants}>
								<CardTitle className="text-2xl text-center text-blue-800">
									{t("home.cardTitle")}
								</CardTitle>
								<CardDescription className="text-center text-blue-600">
									{t("home.cardDescription")}
								</CardDescription>
							</motion.div>
						</CardHeader>

						<AnimatePresence>
							{isLoggedIn === false && (
								<motion.div
									className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-red-50 p-4 rounded-md my-3 border border-red-200"
									variants={itemVariants}
									initial="hidden"
									animate="visible"
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<p className="text-center text-md text-red-600">{t("home.pleaseLogin")}</p>
									<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
										<Button
											variant="outline"
											className="border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700 bg-transparent"
											onClick={() => (window.location.href = "/login")}
										>
											{t("home.loginCta")}
										</Button>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{submissionError && (
								<motion.div
									className="bg-red-50 border border-red-200 p-4 mx-6 my-3 rounded-md"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ type: "spring", stiffness: 300, damping: 25 }}
								>
									<div className="flex items-start">
										<AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
										<p className="text-red-700">{submissionError}</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<TooltipProvider>
							<CardContent className="space-y-6 pt-6">
								<motion.div className="space-y-2" variants={itemVariants}>
									<label className="text-md font-medium text-gray-700">
										{t("home.shortDescription")}{" "}
										<span className="text-red-500 text-sm font-bold ml-1">*</span>
									</label>
									<Input
										ref={shortDescriptionRef}
										value={formData.shortDescription}
										onChange={(e) => handleChange("shortDescription", e.target.value)}
										placeholder={t("home.shortDescriptionPlaceholder")}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												priorityTriggerRef.current?.click();
											}
										}}
										className={`w-full rounded-md border border-blue-300 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition duration-150 ease-in-out ${errors.shortDescription ? "border-red-500" : ""}`}
										disabled={isSubmitting}
									/>
								</motion.div>

								<motion.div className="space-y-2" variants={itemVariants}>
									<PrioritySelect
										key={formKey + "priority"}
										value={formData.priority}
										options={ticketOptions.priority}
										error={!!errors.priority}
										onChange={(value) => handleChange("priority", value)}
										triggerRef={priorityTriggerRef}
										onEnter={() => issueTypeTriggerRef.current?.click()}
										disabled={!isLoggedIn || isSubmitting}
									/>
								</motion.div>

								{/* Remaining optional dropdowns */}
								<motion.div className="space-y-2" variants={itemVariants}>
									<OptionSelect
										key={formKey + "issueType"}
										label={t("home.issueType")}
										options={ticketOptions.issueType}
										value={formData.issueType}
										onChange={(value) => handleChange("issueType", value)}
										error={!!errors.issueType}
										extraFieldValue={formData.otherIssue}
										onExtraChange={(value) => handleChange("otherIssue", value)}
										triggerRef={issueTypeTriggerRef}
										onEnter={() => conditionTriggerRef.current?.click()}
										showExtra={formData.issueType === "other"}
										disabled={!isLoggedIn || isSubmitting}
										extraFieldError={!!errors.otherIssue}
									/>
								</motion.div>
								<motion.div className="space-y-2" variants={itemVariants}>
									<OptionSelect
										key={formKey + "condition"}
										label={t("home.condition")}
										options={ticketOptions.condition}
										value={formData.condition}
										onChange={(value) => handleChange("condition", value)}
										error={!!errors.condition}
										extraFieldValue={formData.otherCondition}
										onExtraChange={(value) => handleChange("otherCondition", value)}
										triggerRef={conditionTriggerRef}
										onEnter={() => eventTriggerRef.current?.click()}
										showExtra={formData.condition === "other"}
										disabled={!isLoggedIn || isSubmitting}
										extraFieldError={!!errors.otherCondition}
									/>
								</motion.div>
								<motion.div className="space-y-2" variants={itemVariants}>
									<OptionSelect
										key={formKey + "event"}
										label={t("home.event")}
										options={ticketOptions.event}
										value={formData.event}
										onChange={(value) => handleChange("event", value)}
										error={!!errors.event}
										triggerRef={eventTriggerRef}
										onEnter={() => submitButtonRef.current?.focus()}
										showExtra={false}
										disabled={!isLoggedIn || isSubmitting}
									/>
								</motion.div>

								{/* File Upload Section */}
								<motion.div className="space-y-2" variants={itemVariants}>
									<label className="text-md font-medium text-gray-700">
										Attachments (Optional)
									</label>
									<div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-white">
										<div className="flex flex-col items-center justify-center space-y-4">
											<ImageIcon className="h-12 w-12 text-blue-400" />
											<div className="text-center">
												<p className="text-sm text-gray-600">
													Upload up to 5 images (PNG, JPG, JPEG, GIF, WEBP)
												</p>
												<p className="text-xs text-gray-500 mt-1">Maximum 5MB per file</p>
											</div>
											<input
												ref={fileInputRef}
												type="file"
												multiple
												accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
												onChange={handleFileSelect}
												className="hidden"
												disabled={!isLoggedIn || isSubmitting || files.length >= 5}
											/>
											<Button
												type="button"
												variant="outline"
												className="bg-white hover:bg-blue-50 border-blue-400 text-blue-600"
												disabled={!isLoggedIn || isSubmitting || files.length >= 5}
												onClick={() => fileInputRef.current?.click()}
											>
												<Upload className="mr-2 h-4 w-4" />
												Select Images
											</Button>
											{files.length > 0 && (
												<div className="w-full">
													<p className="text-xs text-gray-500 mb-2">
														{files.length} of 5 files selected
													</p>
													<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
														{files.map((fileData) => (
															<div
																key={fileData.id}
																className="relative group rounded-lg overflow-hidden border border-gray-200"
															>
																<img
																	src={fileData.preview}
																	alt="Preview"
																	className="w-full h-24 object-cover"
																/>
																<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
																		onClick={() => handleRemoveFile(fileData.id)}
																		disabled={isSubmitting}
																	>
																		<X className="h-4 w-4" />
																	</Button>
																</div>
																<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
																	{formatFileSize(fileData.file.size)}
																</div>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							</CardContent>
						</TooltipProvider>

						<CardFooter>
							<motion.div
								className="w-full"
								variants={buttonVariants}
								whileTap={!(!isLoggedIn || isSubmitting) ? "tap" : false}
								whileHover={!(!isLoggedIn || isSubmitting) ? "hover" : false}
							>
								<Button
									ref={submitButtonRef}
									onClick={handleSubmit}
									disabled={!isLoggedIn || isSubmitting}
									className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{isUploading ? "Uploading files..." : t("home.submitting")}
										</>
									) : (
										t("home.submitTicketCta")
									)}
								</Button>
							</motion.div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
