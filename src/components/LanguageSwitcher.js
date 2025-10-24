"use client";

import { useState, useTransition } from "react";
import { useI18n } from "@/context/I18nContext";
import { setLocale } from "@/lib/actions/localeActions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
	const { locale } = useI18n();
	const [pending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

	const setLocaleAction = async (nextLocale) => {
		if (pending || nextLocale === locale) return;
		startTransition(async () => {
			try {
				const result = await setLocale(nextLocale);
				if (result.success) {
					window.location.reload();
				}
			} catch (e) {
				// noop
			}
		});
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
					{locale === "bg" ? "BG" : "EN"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setLocaleAction("en")} className="cursor-pointer">
					EN — English
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setLocaleAction("bg")} className="cursor-pointer">
					BG — Български
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
