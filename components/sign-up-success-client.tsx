"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";

export function SignUpSuccessClient() {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.auth_pages.registration_success}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    {t.auth_pages.registration_success_desc}
                </p>

                <div className="space-y-3">
                    <Link href="/auth/login" className="btn-primary w-full block">
                        {t.auth_pages.return_to_login}
                    </Link>
                    <div className={`flex items-center gap-2 justify-center text-sm text-gray-500 dark:text-gray-400 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Mail size={14} />
                        <span className="text-xs">{t.auth_pages.check_spam}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
