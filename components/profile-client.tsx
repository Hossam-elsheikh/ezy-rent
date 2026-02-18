"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { ProfileForm } from "@/components/profile-form";
import { UserProfile } from "@/lib/types";
import { User, Mail, Shield } from "lucide-react";

interface ProfileClientProps {
    user: UserProfile;
}

export function ProfileClient({ user }: ProfileClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.dashboard.my_profile}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{isRTL ? "إدارة معلوماتك الشخصية" : "Manage your personal information"}</p>
                </div>

                {/* Profile card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-r from-teal-500 to-indigo-600" />
                    <div className="px-6 pb-6">
                        <div className={`-mt-10 mb-4 flex items-end justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-gray-900">
                                {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            {user.role === "admin" && (
                                <span className="flex items-center gap-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    <Shield size={12} /> {t.admin.title}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
                        <div className={`flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Mail size={13} /> {user.email}
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <User size={18} className="text-teal-500" /> {t.profile.personal_info}
                    </h3>
                    <ProfileForm user={user} />
                </div>
            </div>
        </div>
    );
}
