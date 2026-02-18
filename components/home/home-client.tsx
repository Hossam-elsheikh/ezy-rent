"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitCard } from "@/components/unit-card";
import { Unit, UserProfile } from "@/lib/types";
import Link from "next/link";
import { Building2, Search, Shield, Star, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";

interface HomeClientProps {
    user: UserProfile | null;
    featuredUnits: Unit[];
    totalUnits: number;
    totalCountries: number;
    favorites: string[];
}

export function HomeClient({ user, featuredUnits, totalUnits, totalCountries, favorites }: HomeClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="hero-gradient">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                        <div className="text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                                <Star size={14} className="fill-yellow-300 text-yellow-300" />
                                {isRTL ? "يثق بنا الآلاف" : "Trusted by thousands of renters"}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
                                {t.home.hero_title}
                                <br />
                                <span className="text-yellow-300">{t.home.hero_subtitle}</span>
                            </h1>
                            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up">
                                {t.home.hero_desc}
                            </p>

                            {/* Quick search */}
                            <div className="max-w-2xl mx-auto animate-fade-in-up">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 sm:bg-white sm:dark:bg-gray-900 sm:p-2 sm:rounded-2xl sm:shadow-2xl">
                                    <div className="flex-1 flex items-center gap-3 px-5 py-4 sm:py-0 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-none sm:bg-transparent shadow-xl sm:shadow-none">
                                        <Search size={20} className="text-gray-400 shrink-0" />
                                        <input
                                            type="text"
                                            placeholder={t.home.search_placeholder}
                                            className={`flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base sm:text-sm ${isRTL ? 'text-right' : ''}`}
                                        />
                                    </div>
                                    <Link
                                        href="/units"
                                        className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap py-4 sm:py-2 px-8 rounded-2xl sm:rounded-xl shadow-lg sm:shadow-none font-semibold text-base sm:text-sm"
                                    >
                                        {t.home.browse_btn} <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" className="fill-gray-50 dark:fill-gray-950" />
                    </svg>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {[
                        { label: t.home.stats_active, value: totalUnits || 0, icon: Building2, color: "teal" },
                        { label: t.home.stats_countries, value: totalCountries || 0, icon: MapPin, color: "indigo" },
                        { label: t.home.stats_renters, value: "1K+", icon: Star, color: "amber" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mx-auto mb-3`}>
                                <stat.icon size={20} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Units */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <div className={isRTL ? 'text-right' : ''}>
                        <div className={`flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-medium mb-1`}>
                            <TrendingUp size={14} /> {t.home.latest_listings}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.home.featured_title}</h2>
                    </div>
                    <Link
                        href="/units"
                        className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                    >
                        {t.home.view_all} <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                    </Link>
                </div>

                {featuredUnits && featuredUnits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                        {featuredUnits.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit as Unit}
                                isFavorited={favorites.includes(unit.id)}
                                showFavorite={!!user}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 dark:text-gray-600">
                        <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">{t.home.no_units}</p>
                        <p className="text-sm mt-1">{isRTL ? "تأكد مرة أخرى لاحقاً!" : "Check back soon!"}</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-teal-600 to-indigo-600 py-16 mb-0">
                <div className={`max-w-4xl mx-auto px-4 text-center text-white ${isRTL ? 'text-right' : ''}`}>
                    <h2 className="text-3xl font-bold mb-4">{t.home.cta_title}</h2>
                    <p className="text-white/80 mb-8 text-lg">
                        {t.home.cta_desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Link
                                href="/dashboard/list-unit"
                                className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                {t.home.cta_btn}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/sign-up"
                                    className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                                >
                                    {t.auth.sign_up}
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    {t.auth.sign_in}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white dark:bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t.home.why_choose}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{t.home.why_desc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Search, title: t.home.feature_1_title, desc: t.home.feature_1_desc, color: "teal" },
                            { icon: Shield, title: t.home.feature_2_title, desc: t.home.feature_2_desc, color: "indigo" },
                            { icon: Star, title: t.home.feature_3_title, desc: t.home.feature_3_desc, color: "amber" },
                        ].map((f) => (
                            <div key={f.title} className="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className={`w-14 h-14 rounded-2xl bg-${f.color}-100 dark:bg-${f.color}-900/30 flex items-center justify-center mx-auto mb-4`}>
                                    <f.icon size={24} className={`text-${f.color}-600 dark:text-${f.color}-400`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/icon.svg"
                            alt="EzyRent Icon"
                            width={28}
                            height={28}
                            className="h-7 w-7 object-contain"
                        />
                        <span className="text-white font-bold">EzyRent</span>
                    </Link>
                    <p className="text-sm">© 2026 EzyRent. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/units" className="hover:text-white transition-colors">{t.nav.browse}</Link>
                        <Link href="/auth/sign-up" className="hover:text-white transition-colors">{t.auth.sign_up}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
