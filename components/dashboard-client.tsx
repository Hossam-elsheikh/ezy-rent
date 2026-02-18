"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Heart, PlusCircle, User, Building2, Clock } from "lucide-react";

interface DashboardClientProps {
    user: UserProfile;
    favCount: number;
    reqCount: number;
    pendingCount: number;
}

export function DashboardClient({ user, favCount, reqCount, pendingCount }: DashboardClientProps) {
    const { t, isRTL } = useLanguage();

    const stats = [
        { label: t.dashboard.saved_units, value: favCount || 0, icon: Heart, color: "rose", href: "/dashboard/favorites" },
        { label: t.dashboard.my_requests, value: reqCount || 0, icon: PlusCircle, color: "teal", href: "/dashboard/my-requests" },
        { label: t.dashboard.pending_review, value: pendingCount || 0, icon: Clock, color: "amber", href: "/dashboard/my-requests" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome */}
                <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t.dashboard.welcome}, {user.full_name.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.activity_overview}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <Link key={stat.label} href={stat.href} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-3`}>
                                <stat.icon size={20} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/list-unit"
                        className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5"
                    >
                        <PlusCircle size={28} className="mb-3" />
                        <h3 className="text-lg font-semibold mb-1">{t.dashboard.list_new_unit}</h3>
                        <p className="text-teal-100 text-sm">{t.dashboard.submit_for_review}</p>
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                        <User size={28} className="text-indigo-500 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t.dashboard.my_profile}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{isRTL ? "تحديث معلوماتك الشخصية" : "Update your personal information"}</p>
                    </Link>
                    <Link
                        href="/dashboard/favorites"
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                        <Heart size={28} className="text-rose-500 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t.dashboard.saved_units}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{isRTL ? "عرض وحدتك المفضلة" : "View your favorited units"}</p>
                    </Link>
                    <Link
                        href="/units"
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                        <Building2 size={28} className="text-teal-500 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t.nav.browse}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{isRTL ? "استعرض الوحدات المتاحة للإيجار" : "Explore available rental units"}</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
