"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate } from "@/lib/helpers";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Building2, PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import { DeleteUnitButton } from "@/components/admin/delete-unit-button";

interface AdminUnitsClientProps {
    user: UserProfile;
    units: any[];
}

export function AdminUnitsClient({ user, units }: AdminUnitsClientProps) {
    const { t, isRTL } = useLanguage();

    const statusBadge: Record<string, string> = {
        pending: "badge-pending",
        approved: "badge-approved",
        rejected: "badge-rejected",
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className={`flex items-center justify-between mb-8 `}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.nav.units}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {units?.length || 0} {t.admin.total_units_subtitle}
                        </p>
                    </div>
                    <Link href="/admin/units/new" className={`btn-primary flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <PlusCircle size={16} /> {t.admin.add_unit}
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.admin.unit_col}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.admin.location_col}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.admin.price_col}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.admin.status_col}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.admin.date_col}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{t.admin.actions_col}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {units?.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className={`font-medium text-gray-900 dark:text-white truncate max-w-[200px] ${isRTL ? 'text-right' : ''}`}>{unit.title}</p>
                                            <p className={`text-xs text-gray-400 mt-0.5 ${isRTL ? 'text-right' : ''}`}>{unit.persons} {t.unit.persons}</p>
                                        </td>
                                        <td className={`px-5 py-4 text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : ''}`}>
                                            {[unit.city, unit.country].filter(Boolean).join(", ")}
                                        </td>
                                        <td className={`px-5 py-4 font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}>
                                            {formatPrice(unit.price)}
                                        </td>
                                        <td className={`px-5 py-4 ${isRTL ? 'text-right' : ''}`}>
                                            <span className={statusBadge[unit.status]}>
                                                {t.admin.status_badges[unit.status as keyof typeof t.admin.status_badges] || unit.status}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 text-gray-500 dark:text-gray-400 text-xs ${isRTL ? 'text-right' : ''}`}>
                                            {formatDate(unit.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                                                <Link
                                                    href={`/units/${unit.id}`}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                                                >
                                                    <Eye size={15} />
                                                </Link>
                                                <Link
                                                    href={`/admin/units/${unit.id}/edit`}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <DeleteUnitButton unitId={unit.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!units || units.length === 0) && (
                            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
                                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                                <p>{t.admin.no_units_yet}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
