"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useI18n } from "@/context/I18nContext"

export default function MultiSelectFilter({
    label,
    options,
    selected,
    onChange,
    disabled
}) {
    const { t } = useI18n()
    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option))
        } else {
            onChange([...selected, option])
        }
    }

    const displayText = selected.length === 0
        ? t("tickets.allWithLabel", { label: label.toLowerCase() })
        : selected.length === 1
            ? selected[0]
            : `${selected.length} ${label}`

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full sm:w-[180px] justify-between"
                    disabled={disabled}
                >
                    <span className="truncate">{displayText}</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]" align="start">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {selected.length > 0 && (
                    <>
                        <DropdownMenuCheckboxItem
                            checked={false}
                            onCheckedChange={() => onChange([])}
                            className="font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                        >
                            {t("tickets.clearAll")}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option}
                        checked={selected.includes(option)}
                        onCheckedChange={() => toggleOption(option)}
                    >
                        {option}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

