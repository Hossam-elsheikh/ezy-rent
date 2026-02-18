"use client";

import { Unit } from "@/lib/types";
import { formatPrice, formatDate, getImageUrl } from "@/lib/helpers";
import { Heart, MapPin, Users, Calendar, BadgeCheck, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

interface UnitCardProps {
    unit: Unit;
    isFavorited?: boolean;
    isAdmin?: boolean;
    showFavorite?: boolean;
    onFavoriteToggle?: (unitId: string, isFav: boolean) => void;
    onDelete?: (unitId: string) => void;
}

export function UnitCard({ unit, isFavorited = false, isAdmin = false, showFavorite = false, onFavoriteToggle, onDelete }: UnitCardProps) {
    const { t, isRTL, language } = useLanguage();
    const [favorited, setFavorited] = useState(isFavorited);
    const [favLoading, setFavLoading] = useState(false);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const imageUrl = getImageUrl(supabaseUrl, unit.image_path);

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (favLoading) return;
        setFavLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = "/auth/login";
            return;
        }
        if (favorited) {
            await supabase.from("favorites").delete().eq("unit_id", unit.id).eq("user_id", user.id);
        } else {
            await supabase.from("favorites").insert({ unit_id: unit.id, user_id: user.id });
        }
        setFavorited(!favorited);
        onFavoriteToggle?.(unit.id, !favorited);
        setFavLoading(false);
    };

    return (
        <div className="unit-card group" dir={isRTL ? "rtl" : "ltr"}>
            {/* Image */}
            <div className="relative h-52 bg-gradient-to-br from-teal-100 to-indigo-100 dark:from-teal-900/30 dark:to-indigo-900/30 overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={unit.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-teal-300 dark:text-teal-700 opacity-50">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex gap-2`}>
                    {unit.available ? (
                        <span className="badge-approved flex items-center gap-1">
                            <BadgeCheck size={11} /> {t.unit.available}
                        </span>
                    ) : (
                        <span className="badge-rejected">{isRTL ? "غير متاح" : "Unavailable"}</span>
                    )}
                    {unit.negotiable && (
                        <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
                            {t.unit.negotiable}
                        </span>
                    )}
                </div>

                {/* Favorite button */}
                {showFavorite && (
                    <button
                        onClick={handleFavorite}
                        disabled={favLoading}
                        className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform`}
                    >
                        <Heart
                            size={15}
                            className={favorited ? "fill-rose-500 text-rose-500" : "text-gray-400"}
                        />
                    </button>
                )}

                {/* Admin actions */}
                {isAdmin && (
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} flex gap-1`}>
                        <Link
                            href={`/admin/units/${unit.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <Pencil size={13} className="text-gray-600 dark:text-gray-300" />
                        </Link>
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete?.(unit.id); }}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <Trash2 size={13} className="text-red-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <Link href={`/units/${unit.id}`} className="block p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {unit.title}
                    </h3>
                    <div className={`${isRTL ? 'text-left' : 'text-right'} shrink-0`}>
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{formatPrice(unit.price, language)}</p>
                        <p className="text-xs text-gray-400">{t.unit.per_month}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
                    <MapPin size={12} />
                    <span className="truncate">{[unit.district, unit.city, unit.country].filter(Boolean).join(", ")}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                    <span className="flex items-center gap-1">
                        <Users size={12} /> {unit.persons} {t.unit.persons}
                    </span>
                    {unit.available_at && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(unit.available_at, language)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
