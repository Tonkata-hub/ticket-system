"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { login } from "./actions";
import { useFormStatus } from "react-dom";

export default function LoginPage() {
    const [state, loginAction] = useActionState(login, undefined);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="w-full min-h-[calc(100vh-64px-69px)] bg-blue-50 flex items-center justify-center">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-[#3056d3] mb-8">Вход в системата</h1>

                    <p className="text-center text-gray-600 mb-8">
                        Въведете вашите данни за достъп до системата за билети
                    </p>

                    <form action={loginAction} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Имейл адрес
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3056d3]"
                                placeholder="example@company.com"
                            />
                        </div>
                        {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Парола
                                </label>
                                <Link href="/forgot-password" className="text-sm text-[#3056d3] hover:underline">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3056d3]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {state?.errors?.password && <p className="text-red-500">{state.errors.password}</p>}
                        </div>

                        <SubmitButton />
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Нямате акаунт?{" "}
                            <Link href="/register" className="text-[#3056d3] hover:underline">
                                Регистрирайте се
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="w-full bg-[#3056d3] text-white py-2 px-4 rounded-md hover:bg-[#2045c0] transition-colors"
        >
            Вход
        </button>
    );
}
