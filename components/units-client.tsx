"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitCard } from "@/components/unit-card";
import { UnitSearchFilters } from "@/components/unit-search-filters";
import { Unit, UserProfile } from "@/lib/types";
import { Building2 } from "lucide-react";
import { Suspense } from "react";

interface UnitsClientProps {
    user: UserProfile | null;
    units: any[];
    countries: string[];
    cities: string[];
    districts: string[];
    favorites: string[];
    params: any;
}

export function UnitsClient({ user, units, countries, cities, districts, favorites, params }: UnitsClientProps) {
    const { t, isRTL } = useLanguage();
    const hasFilters = Object.values(params).some((v) => v);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t.dashboard.browse_units_title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {units?.length || 0} {t.dashboard.units_found}
                        {hasFilters ? ` ${t.dashboard.matching_filters}` : ""}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <Suspense>
                        <UnitSearchFilters
                            countries={countries}
                            cities={cities}
                            districts={districts}
                        />
                    </Suspense>
                </div>

                {/* Grid */}
                {units && units.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                        {units.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit as Unit}
                                isFavorited={favorites.includes(unit.id)}
                                showFavorite={!!user}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400 dark:text-gray-600">
                        <Building2 size={56} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">{t.dashboard.no_units_found}</p>
                        <p className="text-sm mt-2 text-gray-400 dark:text-gray-600">
                            {hasFilters ? t.dashboard.try_adjusting : (isRTL ? "لا توجد وحدات متاحة بعد" : "No units available yet")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
