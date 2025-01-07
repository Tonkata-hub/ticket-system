"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/'); // Redirect to the homepage or another appropriate page
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST', // Ensure method is POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                login(); // Assuming `login` sets the state and redirects as needed
            } else {
                const data = await response.json();
                setError(data.error || 'Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-[calc(100vh-10.6rem)] md:h-[calc(100vh-8.5rem)] bg-blue-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-blue-700">Вход в Системата за Билети</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-blue-500">
                        Въведете данните си за достъп до вашия профил
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Имейл</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Парола</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive" className="mt-4 bg-red-100 border-red-400 text-red-700">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Влизане...' : 'Вход'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between text-xs sm:text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:underline transition-colors duration-300">
                        Забравена парола?
                    </Link>
                    <Link href="/signup" className="text-blue-600 hover:underline transition-colors duration-300">
                        Нямате акаунт? Регистрация
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}