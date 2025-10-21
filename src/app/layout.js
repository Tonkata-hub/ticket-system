import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { I18nProvider } from "../context/I18nContext";
import { cookies } from "next/headers";
import { getDictionary, getFallbackLocale } from "@/lib/i18n";

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

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("locale")?.value;
	const locale = cookieLocale || getFallbackLocale();
	const dictionary = getDictionary(locale);

	return (
		<html lang={locale}>
			<body>
				<AuthProvider>
					<I18nProvider locale={locale} dictionary={dictionary}>
						<Navbar />
						{children}
						<Footer />
					</I18nProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
