"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/lib/authContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (email === 'admin@gmail.com' && password === 'test123123') {
                login();
            } else {
                setError('Invalid email or password');
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
                    <CardTitle className="text-xl sm:text-2xl font-bold text-blue-700">Login to Ticket System</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-blue-500">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between text-xs sm:text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:text-emerald-600 transition-colors duration-300">
                        Forgot password?
                    </Link>
                    <Link href="/signup" className="text-blue-600 hover:text-emerald-600 transition-colors duration-300">
                        Don't have an account? Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
