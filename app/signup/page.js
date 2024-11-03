'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Паролите не съвпадат');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Here you would typically make an API call to register the user
            console.log('User registered:', { fullName, email, password });
            router.push('/');
        } catch (err) {
            setError('Възникна грешка при регистрацията. Моля, опитайте отново.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10.6rem)] md:min-h-[calc(100vh-8.5rem)] bg-blue-50 px-4 sm:px-6 lg:px-8 py-8">
            <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-blue-700">Регистрация в Системата за Билети</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-blue-500">
                        Създайте нов акаунт, за да използвате системата
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-700">Пълно име</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Иван Иванов"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700">Потвърдете паролата</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {isLoading ? 'Регистрация...' : 'Регистрация'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-xs sm:text-sm">
                    <Link href="/login" className="text-blue-600 hover:underline transition-colors duration-300">
                        Вече имате акаунт? Вход
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}