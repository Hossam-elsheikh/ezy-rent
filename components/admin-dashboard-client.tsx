"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Building2, Users, ClipboardList, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";

interface AdminDashboardClientProps {
    user: UserProfile;
    stats: {
        totalUnits: number;
        totalUsers: number;
        pendingRequests: number;
        approvedRequests: number;
        rejectedRequests: number;
    };
    recentRequests: any[];
}

export function AdminDashboardClient({ user, stats, recentRequests }: AdminDashboardClientProps) {
    const { t, isRTL } = useLanguage();

    const statCards = [
        { label: t.admin.total_units, value: stats.totalUnits, icon: Building2, color: "teal", href: "/admin/units" },
        { label: t.admin.total_users, value: stats.totalUsers, icon: Users, color: "indigo", href: "/admin/users" },
        { label: t.admin.pending, value: stats.pendingRequests, icon: Clock, color: "amber", href: "/admin/requests" },
        { label: t.admin.approved, value: stats.approvedRequests, icon: CheckCircle, color: "emerald", href: "/admin/requests?status=approved" },
        { label: t.admin.rejected, value: stats.rejectedRequests, icon: XCircle, color: "red", href: "/admin/requests?status=rejected" },
    ];

    const quickLinks = [
        {
            title: t.admin.manage_units,
            desc: t.admin.manage_units_desc,
            icon: Building2,
            color: "teal",
            href: "/admin/units"
        },
        {
            title: t.admin.manage_users,
            desc: t.admin.manage_users_desc,
            icon: Users,
            color: "indigo",
            href: "/admin/users"
        },
        {
            title: t.admin.review_requests,
            desc: `${stats.pendingRequests} ${t.admin.review_requests_desc}`,
            icon: ClipboardList,
            color: "amber",
            href: "/admin/requests"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.admin.dashboard_title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.manage_desc}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow ${isRTL ? 'text-right' : ''}`}
                        >
                            <div className={`w-9 h-9 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-2`}>
                                <stat.icon size={18} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick nav */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-center gap-4 ${isRTL ? 'text-right' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-${link.color}-100 dark:bg-${link.color}-900/30 flex items-center justify-center shrink-0`}>
                                <link.icon size={22} className={`text-${link.color}-600 dark:text-${link.color}-400`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{link.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-nowrap">{link.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pending requests preview */}
                {recentRequests && recentRequests.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h2 className={`font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
                                <Clock size={16} className="text-amber-500" /> {t.admin.recent_requests}
                            </h2>
                            <Link href="/admin/requests" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                                {t.admin.view_all}
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recentRequests.map((req) => (
                                <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{req.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t.admin.by} {(req.requester as { full_name: string } | null)?.full_name || "Unknown"} · {req.city}, {req.country}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/requests/${req.id}`}
                                        className={`shrink-0 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1`}
                                    >
                                        {t.admin.review_btn} <ArrowRight size={12} className={isRTL ? "rotate-180" : ""} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
