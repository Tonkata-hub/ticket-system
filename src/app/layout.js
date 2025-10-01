import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        default: "Support Ticket System",
        template: "%s | Support Ticket System",
    },
    description:
        "Submit support tickets and track resolutions. Admins and managers can review, update statuses, and contact clients to resolve issues quickly.",
    keywords: [
        "support tickets",
        "helpdesk",
        "customer support",
        "issue tracking",
        "ticket management",
        "client support",
        "service desk",
    ],
    applicationName: "Support Ticket System",
    category: "Customer Support",
    openGraph: {
        title: "Support Ticket System",
        description:
            "Submit support tickets and track resolutions. Admins and managers can review, update statuses, and contact clients.",
        siteName: "Support Ticket System",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Support Ticket System",
        description:
            "Submit support tickets and track resolutions. Admins and managers can review, update statuses, and contact clients.",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}