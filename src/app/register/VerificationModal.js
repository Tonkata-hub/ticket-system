"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerificationModal({ isOpen, onClose, userId, userEmail }) {
    const router = useRouter();
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
            const response = await fetch("/api/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    code: fullCode,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.error || "Verification failed");
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
            const response = await fetch("/api/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (data.success) {
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
                setError(data.error || "Failed to resend code");
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                >
                    {success ? (
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                            <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
                            <p className="text-sm text-gray-500">Redirecting to login page...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-[#3056d3] mb-2">Verify Your Email</h2>
                                <p className="text-gray-600">We sent a 6-digit code to</p>
                                <p className="font-medium text-gray-900">{userEmail}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-center space-x-2">
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
                                            className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3056d3] focus:border-transparent"
                                        />
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-50 border border-red-200 rounded-md p-3"
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
                                    className="w-full bg-[#3056d3] text-white py-3 px-4 rounded-md hover:bg-[#2045c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resendCooldown > 0 || isResending}
                                        className="text-[#3056d3] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                                                Sending...
                                            </div>
                                        ) : resendCooldown > 0 ? (
                                            <div className="flex items-center justify-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Resend in {resendCooldown}s
                                            </div>
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
