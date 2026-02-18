"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitForm } from "@/components/unit-form";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

interface EditUnitClientProps {
    user: UserProfile;
    unit: any;
}

export function EditUnitClient({ user, unit }: EditUnitClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/admin/units"
                    className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {isRTL ? "العودة إلى الوحدات" : "Back to Units"}
                </Link>

                <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Pencil size={20} className="text-indigo-500" /> {isRTL ? "تعديل الوحدة" : "Edit Unit"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{unit.title}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <UnitForm mode="edit" initialData={unit} isRequest={false} />
                </div>
            </div>
        </div>
    );
}
