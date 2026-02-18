"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate } from "@/lib/helpers";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { PlusCircle, Clock, CheckCircle, XCircle } from "lucide-react";

interface MyRequestsClientProps {
    user: UserProfile;
    requests: any[];
}

export function MyRequestsClient({ user, requests }: MyRequestsClientProps) {
    const { t, isRTL } = useLanguage();

    const statusBadge = {
        pending: "badge-pending",
        approved: "badge-approved",
        rejected: "badge-rejected",
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.dashboard.my_requests}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{isRTL ? "تتبع طلبات إدراج وحداتك" : "Track your unit listing requests"}</p>
                    </div>
                    <Link href="/dashboard/list-unit" className="btn-primary flex items-center gap-2">
                        <PlusCircle size={16} /> {isRTL ? "طلب جديد" : "New Request"}
                    </Link>
                </div>

                {requests && requests.length > 0 ? (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${isRTL ? 'text-right' : ''}`}>{req.title}</h3>
                                            <span className={statusBadge[req.status as keyof typeof statusBadge]}>
                                                {t.admin.status_badges[req.status as keyof typeof t.admin.status_badges] || req.status}
                                            </span>
                                        </div>
                                        <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : ''}`}>
                                            {[req.district, req.city, req.country].filter(Boolean).join(", ")} · {formatPrice(req.price)}/{t.unit.per_month}
                                        </p>
                                        {req.admin_note && (
                                            <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${req.status === "rejected"
                                                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                } ${isRTL ? 'text-right' : ''}`}>
                                                <span className="font-medium">{isRTL ? "ملاحظة المسئول:" : "Admin note:"}</span> {req.admin_note}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`${isRTL ? 'text-left' : 'text-right'} shrink-0`}>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(req.created_at)}</p>
                                        {req.reviewed_at && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {isRTL ? "تمت المراجعة في " : "Reviewed "} {formatDate(req.reviewed_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <PlusCircle size={56} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            {isRTL ? "لا توجد طلبات بعد" : "No requests yet"}
                        </p>
                        <p className="text-sm mt-2 text-gray-400 dark:text-gray-600 mb-6">
                            {isRTL ? "قدم طلباً لإدراج وحدتك على إيزي رنت" : "Submit a request to list your unit on EzyRent"}
                        </p>
                        <Link href="/dashboard/list-unit" className="btn-primary inline-flex items-center gap-2">
                            <PlusCircle size={16} /> {t.dashboard.list_new_unit}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
