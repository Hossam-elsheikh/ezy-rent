"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { AdminUserForm } from "@/components/admin/user-form";
import { UserProfile } from "@/lib/types";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminNewUserClientProps {
    user: UserProfile;
}

export function AdminNewUserClient({ user }: AdminNewUserClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/admin/users"
                    className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {t.admin.back_to_users}
                </Link>

                <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <UserPlus size={22} className="text-indigo-500" /> {t.admin.create_user}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.add_user_desc}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <AdminUserForm mode="create" />
                </div>
            </div>
        </div>
    );
}
