"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate, getCountryName, getCountryCurrency } from "@/lib/helpers";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";

interface AdminRequestsClientProps {
    user: UserProfile;
    requests: any[];
    status?: string;
}

export function AdminRequestsClient({ user, requests, status }: AdminRequestsClientProps) {
    const { t, isRTL, language } = useLanguage();

    const statusBadge: Record<string, string> = {
        pending: "badge-pending",
        approved: "badge-approved",
        rejected: "badge-rejected",
    };

    const tabs = [
        { label: isRTL ? "الكل" : "All", value: "", icon: ClipboardList },
        { label: isRTL ? "قيد الانتظار" : "Pending", value: "pending", icon: Clock },
        { label: isRTL ? "تمت الموافقة" : "Approved", value: "approved", icon: CheckCircle },
        { label: isRTL ? "مرفوض" : "Rejected", value: "rejected", icon: XCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ClipboardList size={28} className="text-amber-500" /> {isRTL ? "طلبات الوحدات" : "Unit Requests"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{isRTL ? "مراجعة والموافقة على طلبات المستخدمين" : "Review and approve user listing requests"}</p>
                </div>

                {/* Tabs */}
                <div className={`flex gap-2 mb-6 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 w-fit ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {tabs.map((tab) => (
                        <Link
                            key={tab.value}
                            href={tab.value ? `/admin/requests?status=${tab.value}` : "/admin/requests"}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${(status || "") === tab.value
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الطلب" : "Request"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "مقدم الطلب" : "Requester"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الموقع" : "Location"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "السعر" : "Price"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الحالة" : "Status"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "التاريخ" : "Date"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? "إجراء" : "Action"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {requests?.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{req.title}</p>
                                            <p className="text-xs text-gray-400">{req.persons} {t.unit.persons}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                                {(req.requester as { full_name: string } | null)?.full_name || "—"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {(req.requester as { email: string } | null)?.email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-xs">
                                            {[req.city, getCountryName(req.country, language)].filter(Boolean).join(", ")}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                                            {formatPrice(req.price, language, req.currency || getCountryCurrency(req.country))}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={statusBadge[req.status]}>
                                                {t.admin.status_badges[req.status as keyof typeof t.admin.status_badges] || req.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                            {formatDate(req.created_at)}
                                        </td>
                                        <td className={`px-5 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                                            <Link
                                                href={`/admin/requests/${req.id}`}
                                                className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
                                            >
                                                {isRTL ? "مراجعة ←" : "Review →"}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!requests || requests.length === 0) && (
                            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
                                <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                                <p>{isRTL ? "لا توجد طلبات" : "No requests found"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
