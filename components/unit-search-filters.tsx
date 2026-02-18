import { UnitFilters } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";

interface UnitSearchFiltersProps {
    countries: string[];
    cities: string[];
    districts: string[];
}

export function UnitSearchFilters({ countries, cities, districts }: UnitSearchFiltersProps) {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<UnitFilters>({
        search: searchParams.get("search") || "",
        country: searchParams.get("country") || "",
        city: searchParams.get("city") || "",
        district: searchParams.get("district") || "",
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        persons: searchParams.get("persons") ? Number(searchParams.get("persons")) : undefined,
        available: searchParams.get("available") === "true" ? true : undefined,
    });

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.country) params.set("country", filters.country);
        if (filters.city) params.set("city", filters.city);
        if (filters.district) params.set("district", filters.district);
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
        if (filters.persons) params.set("persons", String(filters.persons));
        if (filters.available) params.set("available", "true");
        router.push(`/units?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({ search: "", country: "", city: "", district: "" });
        router.push("/units");
    };

    const hasActiveFilters = Object.values(filters).some((v) => v !== "" && v !== undefined);

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-gray-400`} />
                    <input
                        type="text"
                        placeholder={t.dashboard.search_units_placeholder}
                        value={filters.search || ""}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || hasActiveFilters
                        ? "bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                >
                    <SlidersHorizontal size={15} />
                    {t.dashboard.filters_btn}
                    {hasActiveFilters && (
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    )}
                </button>
                <button onClick={applyFilters} className="btn-primary">
                    {isRTL ? "بحث" : "Search"}
                </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{isRTL ? "الدولة" : "Country"}</label>
                            <select
                                value={filters.country || ""}
                                onChange={(e) => setFilters({ ...filters, country: e.target.value, city: "", district: "" })}
                                className="input-field"
                            >
                                <option value="">{t.dashboard.all_countries}</option>
                                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{isRTL ? "المدينة" : "City"}</label>
                            <select
                                value={filters.city || ""}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value, district: "" })}
                                className="input-field"
                            >
                                <option value="">{t.dashboard.all_cities}</option>
                                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{isRTL ? "الحي" : "District"}</label>
                            <select
                                value={filters.district || ""}
                                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                className="input-field"
                            >
                                <option value="">{t.dashboard.all_districts}</option>
                                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.dashboard.min_persons}</label>
                            <input
                                type="number"
                                min={1}
                                placeholder={t.dashboard.any}
                                value={filters.persons || ""}
                                onChange={(e) => setFilters({ ...filters, persons: e.target.value ? Number(e.target.value) : undefined })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.dashboard.min_price} ($)</label>
                            <input
                                type="number"
                                min={0}
                                placeholder={t.dashboard.any}
                                value={filters.minPrice || ""}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.dashboard.max_price} ($)</label>
                            <input
                                type="number"
                                min={0}
                                placeholder={t.dashboard.any}
                                value={filters.maxPrice || ""}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.available === true}
                                    onChange={(e) => setFilters({ ...filters, available: e.target.checked ? true : undefined })}
                                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t.dashboard.available_only}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={14} /> {t.dashboard.clear_all}
                            </button>
                        )}
                        <button onClick={applyFilters} className="btn-primary text-sm">
                            {t.dashboard.apply_filters}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
