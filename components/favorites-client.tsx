"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitCard } from "@/components/unit-card";
import { UserProfile, Unit } from "@/lib/types";
import { Heart } from "lucide-react";
import Link from "next/link";

interface FavoritesClientProps {
    user: UserProfile;
    favorites: any[];
}

export function FavoritesClient({ user, favorites }: FavoritesClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className={`text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Heart className="text-rose-500" size={28} /> {t.dashboard.saved_units}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {favorites?.length || 0} {t.dashboard.units_found}
                    </p>
                </div>

                {favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                        {favorites.map((fav) => (
                            fav.unit && (
                                <UnitCard
                                    key={fav.id}
                                    unit={fav.unit as Unit}
                                    isFavorited={true}
                                    showFavorite={true}
                                />
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <Heart size={56} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            {isRTL ? "لا توجد وحدات محفوظة بعد" : "No saved units yet"}
                        </p>
                        <p className="text-sm mt-2 text-gray-400 dark:text-gray-600 mb-6">
                            {isRTL ? "تصفح الوحدات وانقر على أيقونة القلب لحفظها هنا" : "Browse units and click the heart icon to save them here"}
                        </p>
                        <Link href="/units" className="btn-primary inline-flex">
                            {t.dashboard.browse_units_title}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
