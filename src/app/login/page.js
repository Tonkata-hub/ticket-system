"use client"

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const { setIsLoggedIn } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(null);
    const [serverError, setServerError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const res = await login(null, formData);
        if (res.success) {
            setIsLoggedIn(true); // Update global login state immediately
            router.push("/");
        } else {
            setErrors(res.errors || null);
            setServerError(res.error || null);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-64px-69px)] bg-blue-50 flex items-center justify-center">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-[#3056d3] mb-8">
                        Вход в системата
                    </h1>

                    <p className="text-center text-gray-600 mb-8">
                        Въведете вашите данни за достъп до системата за билети
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Имейл адрес
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3056d3] ${errors?.email ? "border-red-300" : "border-gray-300"
                                    }`}
                                placeholder="example@company.com"
                            />
                            {errors?.email && <ErrorMessage error={errors.email} />}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Парола
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#3056d3] hover:underline"
                                >
                                    Забравена парола?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3056d3] ${errors?.password ? "border-red-300" : "border-gray-300"
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors?.password && <ErrorMessage error={errors.password} />}
                        </div>

                        <AnimatePresence>
                            {serverError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{serverError}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <SubmitButton />
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Нямате акаунт?{" "}
                            <Link
                                href="/register"
                                className="text-[#3056d3] hover:underline"
                            >
                                Регистрирайте се
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ErrorMessage({ error }) {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start mt-1.5"
                >
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1.5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-600">{error}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SubmitButton() {
    return (
        <button
            type="submit"
            className="w-full bg-[#3056d3] text-white py-2 px-4 rounded-md hover:bg-[#2045c0] transition-colors"
        >
            Вход
        </button>
    );
}