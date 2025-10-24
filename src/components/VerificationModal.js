"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { resendVerification, verifyEmail } from "@/lib/actions/verificationActions";

export default function VerificationModal({ isOpen, onClose, userId, userEmail }) {
	const router = useRouter();
	const { setIsLoggedIn, setRole, setUserEmail } = useAuth();
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [isResending, setIsResending] = useState(false);

	const inputRefs = useRef([]);

	// Auto-focus first input when modal opens
	useEffect(() => {
		if (isOpen && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, [isOpen]);

	// Handle code input changes
	const handleCodeChange = (index, value) => {
		if (!/^\d*$/.test(value)) return; // Only allow digits

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);
		setError("");

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle backspace
	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	// Handle paste
	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
		if (pastedData.length === 6) {
			const newCode = pastedData.split("");
			setCode(newCode);
			setError("");
			inputRefs.current[5]?.focus();
		}
	};

	// Submit verification code
	const handleSubmit = async (e) => {
		e.preventDefault();
		const fullCode = code.join("");

		if (fullCode.length !== 6) {
			setError("Please enter the complete 6-digit code");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const result = await verifyEmail(userId, fullCode);

			if (result.success) {
				// Update authentication state
				setIsLoggedIn(true);
				setRole(result.user.role);
				setUserEmail(result.user.email);

				setSuccess(true);
				setTimeout(() => {
					router.push("/");
				}, 2000);
			} else {
				setError(result.error || "Verification failed");
			}
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Resend verification code
	const handleResend = async () => {
		if (resendCooldown > 0) return;

		setIsResending(true);
		setError("");

		try {
			const result = await resendVerification(userId);

			if (result.success) {
				// Start cooldown timer
				setResendCooldown(60);
				const timer = setInterval(() => {
					setResendCooldown((prev) => {
						if (prev <= 1) {
							clearInterval(timer);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				setError(result.error || "Failed to resend code");
			}
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setIsResending(false);
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100"
				>
					{success ? (
						<div className="text-center">
							<div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
								<CheckCircle className="h-12 w-12 text-green-500" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
							<p className="text-gray-600 mb-4">
								Your email has been successfully verified and you are now logged in.
							</p>
							<p className="text-sm text-gray-500">Redirecting to home page...</p>
						</div>
					) : (
						<>
							<div className="text-center mb-8">
								<div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-[#3056d3]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Email</h2>
								<p className="text-gray-600 text-sm">We sent a 6-digit code to</p>
								<p className="font-semibold text-gray-900 mt-1">{userEmail}</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="flex justify-center gap-3">
									{code.map((digit, index) => (
										<input
											key={index}
											ref={(el) => (inputRefs.current[index] = el)}
											type="text"
											inputMode="numeric"
											maxLength="1"
											value={digit}
											onChange={(e) => handleCodeChange(index, e.target.value)}
											onKeyDown={(e) => handleKeyDown(index, e)}
											onPaste={handlePaste}
											className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3056d3] focus:border-[#3056d3] transition-all shadow-sm hover:border-gray-300"
										/>
									))}
								</div>

								<AnimatePresence>
									{error && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm"
										>
											<div className="flex items-center">
												<AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
												<span className="text-sm text-red-700">{error}</span>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								<button
									type="submit"
									disabled={isSubmitting || code.join("").length !== 6}
									className="w-full bg-[#3056d3] text-white py-3.5 px-4 rounded-lg hover:bg-[#2045c0] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<RefreshCw className="h-4 w-4 animate-spin mr-2" />
											Verifying...
										</div>
									) : (
										"Verify Email"
									)}
								</button>

								<div className="text-center pt-2 border-t border-gray-100">
									<p className="text-sm text-gray-600 mb-3 mt-4">Didn't receive the code?</p>
									<button
										type="button"
										onClick={handleResend}
										disabled={resendCooldown > 0 || isResending}
										className="text-[#3056d3] hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm inline-flex items-center"
									>
										{isResending ? (
											<>
												<RefreshCw className="h-4 w-4 animate-spin mr-1" />
												Sending...
											</>
										) : resendCooldown > 0 ? (
											<>
												<Clock className="h-4 w-4 mr-1" />
												Resend in {resendCooldown}s
											</>
										) : (
											"Resend Code"
										)}
									</button>
								</div>
							</form>
						</>
					)}
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
