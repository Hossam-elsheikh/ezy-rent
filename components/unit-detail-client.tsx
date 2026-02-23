"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate, getImageUrl, getCountryName, getCountryCurrency } from "@/lib/helpers";
import { Unit, UserProfile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Users, Calendar, DollarSign, ExternalLink,
    ArrowLeft, Heart, BadgeCheck, Clock, User
} from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UnitDetailClientProps {
    user: UserProfile | null;
    unit: any;
    id: string;
}

export function UnitDetailClient({ user, unit, id }: UnitDetailClientProps) {
    const { t, isRTL, language } = useLanguage();
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        if (user) {
            const checkFavorite = async () => {
                const supabase = createClient();
                const { data: fav } = await supabase
                    .from("favorites")
                    .select("id")
                    .eq("unit_id", id)
                    .eq("user_id", user.id)
                    .single();
                setIsFavorited(!!fav);
            };
            checkFavorite();
        }
    }, [user, id]);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const imageUrl = getImageUrl(supabaseUrl, unit.image_path);
    const typedUnit = unit as Unit & { owner: { full_name: string; email: string; phone: string } | null };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back */}
                <Link
                    href="/units"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6"
                >
                    <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} /> {t.unit.back_to_units}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-indigo-100 dark:from-teal-900/30 dark:to-indigo-900/30 shadow-lg">
                            {imageUrl ? (
                                <Image src={imageUrl} alt={typedUnit.title} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-teal-300 dark:text-teal-700 opacity-30">
                                        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Status badges */}
                            <div className="absolute top-4 start-4 flex gap-2">
                                {typedUnit.available ? (
                                    <span className="badge-approved flex items-center gap-1">
                                        <BadgeCheck size={12} /> {t.unit.available}
                                    </span>
                                ) : (
                                    <span className="badge-rejected">{t.unit.unavailable}</span>
                                )}
                                {typedUnit.negotiable && (
                                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {t.unit.negotiable}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title & Price */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{typedUnit.title}</h1>
                                <div className="text-end shrink-0">
                                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatPrice(typedUnit.price, language, typedUnit.currency || getCountryCurrency(typedUnit.country))}</p>
                                    <p className="text-xs text-gray-400">{t.unit.per_month}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-teal-500" />
                                    {[typedUnit.district, typedUnit.city, getCountryName(typedUnit.country, language)].filter(Boolean).join(", ")}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users size={14} className="text-teal-500" />
                                    {t.unit.up_to} {typedUnit.persons} {typedUnit.persons === 1 ? t.unit.person : t.unit.persons_plural}
                                </span>
                                {typedUnit.available_at && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-teal-500" />
                                        {t.unit.available_from} {formatDate(typedUnit.available_at, language)}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-teal-500" />
                                    {t.unit.listed_on} {formatDate(typedUnit.created_at, language)}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        {typedUnit.details && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.unit.about_this_unit}</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{typedUnit.details}</p>
                            </div>
                        )}

                        {/* Media link */}
                        {typedUnit.media_link && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.unit.virtual_tour}</h2>
                                <a
                                    href={typedUnit.media_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium"
                                >
                                    <ExternalLink size={14} /> {t.unit.view_media}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Favorite */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <FavoriteButton unitId={id} initialFavorited={isFavorited} isLoggedIn={!!user} />
                        </div>

                        {/* Price breakdown */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.unit.price_details}</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t.unit.monthly_rent}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(typedUnit.price, language, typedUnit.currency || getCountryCurrency(typedUnit.country))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t.unit.negotiable}</span>
                                    <span className={`font-medium ${typedUnit.negotiable ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}`}>
                                        {typedUnit.negotiable ? t.unit.yes : t.unit.no}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t.unit.annual}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(typedUnit.price * 12, language, typedUnit.currency || getCountryCurrency(typedUnit.country))}</span>
                                </div>
                            </div>
                            {/* call owner */}
                            <a
                                href={`tel:${typedUnit.owner.phone}`}
                                className="btn-primary w-full text-center text-sm block my-4"
                            >
                                {t.unit.contact_owner}
                            </a>
                            {/* send whatsapp */}
                            <a
                                href={`https://wa.me/${typedUnit.owner.phone}`}
                                className="btn-primary w-full text-center text-sm block my-4"
                            >
                                {t.unit.contact_owner_whatsapp}
                            </a>
                        </div>

                        {/* Owner info */}
                        {/* {typedUnit.owner && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className={`font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>{t.unit.listed_by}</h3>
                                <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                        {typedUnit.owner.full_name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <div className={isRTL ? "text-right" : ""}>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{typedUnit.owner.full_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.unit.owner}</p>
                                    </div>
                                </div>
                                {typedUnit.owner.phone && (
                                    <a
                                        href={`tel:${typedUnit.owner.phone}`}
                                        className="btn-primary w-full text-center text-sm block"
                                    >
                                        {t.unit.contact_owner}
                                    </a>
                                )}
                            </div>
                        )} */}

                        {/* Location */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t.unit.location}</h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {typedUnit.address && <p>{typedUnit.address}</p>}
                                {typedUnit.district && <p>{t.unit.district}: {typedUnit.district}</p>}
                                <p>{isRTL ? "المدينة" : "City"}: {typedUnit.city}</p>
                                <p>{isRTL ? "الدولة" : "Country"}: {getCountryName(typedUnit.country, language)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
