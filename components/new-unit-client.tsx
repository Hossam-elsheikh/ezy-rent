"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitForm } from "@/components/unit-form";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

interface NewUnitClientProps {
    user: UserProfile;
}

export function NewUnitClient({ user }: NewUnitClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/admin/units"
                    className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6 `}
                >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {isRTL ? "العودة إلى الوحدات" : "Back to Units"}
                </Link>

                <div className={`mb-6 }`}>
                    <h1 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 `}>
                        <PlusCircle size={22} className="text-teal-500" /> {isRTL ? "إضافة وحدة جديدة" : "Add New Unit"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {isRTL ? "سيتم نشر هذه الوحدة فوراً كمعتمدة." : "This unit will be immediately published as approved."}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <UnitForm mode="create" isRequest={false} />
                </div>
            </div>
        </div>
    );
}
