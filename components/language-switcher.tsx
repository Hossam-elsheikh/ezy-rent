"use client";

import { useLanguage } from "@/context/language-context";
import { Globe, Languages } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
    const { language, setLanguage, isRTL } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "ar", label: "العربية", flag: "🇪🇬" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                title="Change Language"
            >
                <Languages size={18} />
            </button>

            {open && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-36 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-[60] animate-fade-in-up`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code as any);
                                setOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm transition-colors ${language === lang.code
                                ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/20"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                        >
                            <span>{lang.label}</span>
                            <span>{lang.flag}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
