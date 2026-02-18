"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate, getImageUrl } from "@/lib/helpers";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, Calendar, DollarSign, ExternalLink, User, Phone, Mail } from "lucide-react";
import { RequestReviewActions } from "@/components/admin/request-review-actions";

interface RequestDetailClientProps {
    user: UserProfile;
    req: any;
    id: string;
}

export function RequestDetailClient({ user, req, id }: RequestDetailClientProps) {
    const { t, isRTL } = useLanguage();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const imageUrl = getImageUrl(supabaseUrl, req.image_path);
    const requester = req.requester as Record<string, string> | null;

    const statusColors: Record<string, string> = {
        pending: "badge-pending",
        approved: "badge-approved",
        rejected: "badge-rejected",
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar user={user} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/admin/requests"
                    className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {isRTL ? "العودة إلى الطلبات" : "Back to Requests"}
                </Link>

                <div className={`flex items-start justify-between gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{req.title}</h1>
                        <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={statusColors[req.status]}>
                                {t.admin.status_badges[req.status as keyof typeof t.admin.status_badges] || req.status}
                            </span>
                            <span className="text-xs text-gray-400">
                                {isRTL ? "تم التقديم" : "Submitted"} {formatDate(req.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isRTL ? 'direction-rtl' : ''}`}>
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Image */}
                        {imageUrl && (
                            <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <Image src={imageUrl} alt={req.title} fill className="object-cover" />
                            </div>
                        )}

                        {/* Details */}
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{isRTL ? "تفاصيل الوحدة" : "Unit Details"}</h2>
                            <div className={`grid grid-cols-2 gap-4 text-sm mb-4 ${isRTL ? 'direction-rtl' : ''}`}>
                                <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <DollarSign size={14} className="text-teal-500" />
                                    <span>{formatPrice(req.price)}/{t.unit.per_month} {req.negotiable && <span className="text-indigo-500">({t.unit.negotiable})</span>}</span>
                                </div>
                                <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Users size={14} className="text-teal-500" />
                                    <span>{req.persons} {t.unit.persons}</span>
                                </div>
                                <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <MapPin size={14} className="text-teal-500" />
                                    <span>{[req.district, req.city, req.country].filter(Boolean).join(", ")}</span>
                                </div>
                                {req.available_at && (
                                    <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Calendar size={14} className="text-teal-500" />
                                        <span>{isRTL ? "متاح من" : "Available"} {formatDate(req.available_at)}</span>
                                    </div>
                                )}
                            </div>
                            {req.address && (
                                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-3 ${isRTL ? 'text-right' : ''}`}>📍 {req.address}</p>
                            )}
                            {req.details && (
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <p className={`text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed ${isRTL ? 'text-right' : ''}`}>{req.details}</p>
                                </div>
                            )}
                            {req.media_link && (
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                                    <a
                                        href={req.media_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                                    >
                                        <ExternalLink size={14} /> {isRTL ? "عرض رابط الوسائط" : "View Media Link"}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Requester */}
                        <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className={`font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <User size={16} className="text-indigo-500" /> {isRTL ? "مقدم الطلب" : "Requester"}
                            </h3>
                            {requester && (
                                <div className="space-y-2 text-sm">
                                    <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                            {requester.full_name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className={isRTL ? 'text-right' : ''}>
                                            <p className="font-medium text-gray-900 dark:text-white">{requester.full_name}</p>
                                            <p className="text-xs text-gray-500">{requester.nationality}</p>
                                        </div>
                                    </div>
                                    {requester.email && (
                                        <p className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <Mail size={12} /> {requester.email}
                                        </p>
                                    )}
                                    {requester.phone && (
                                        <p className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <Phone size={12} /> {requester.phone}
                                        </p>
                                    )}
                                    {requester.profession && (
                                        <p className={`text-gray-500 dark:text-gray-400 text-xs ${isRTL ? 'text-right' : ''}`}>💼 {requester.profession}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Review Actions */}
                        {req.status === "pending" && (
                            <RequestReviewActions requestId={id} />
                        )}

                        {/* Review info */}
                        {req.status !== "pending" && (
                            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : ''}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{isRTL ? "معلومات المراجعة" : "Review Info"}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isRTL ? "تمت المراجعة في" : "Reviewed on"} {formatDate(req.reviewed_at)}
                                </p>
                                {req.admin_note && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">{isRTL ? "ملاحظة:" : "Note:"}</span> {req.admin_note}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
