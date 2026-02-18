"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserProfile } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
    Home,
    Building2,
    Heart,
    PlusCircle,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Shield,
    User,
} from "lucide-react";

interface NavbarProps {
    user: UserProfile | null;
}

export function Navbar({ user }: NavbarProps) {
    const { t, isRTL } = useLanguage();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const isAdmin = user?.role === "admin";

    const navLinks = [
        { href: "/", label: t.nav.browse, icon: Building2 },
    ];

    const userLinks = user
        ? [
            { href: "/dashboard/favorites", label: t.nav.favorites, icon: Heart },
            { href: "/dashboard/my-requests", label: t.nav.my_requests, icon: PlusCircle },
        ]
        : [];

    const adminLinks = isAdmin
        ? [
            { href: "/admin", label: t.nav.admin, icon: Shield },
        ]
        : [];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className={`flex items-center gap-2.5 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
                            <Building2 className="w-4.5 h-4.5 text-white" size={18} />
                        </div>
                        <span className="text-xl font-bold gradient-text">EzyRent</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {[...navLinks, ...userLinks, ...adminLinks].map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                        ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeSwitcher />

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                                        {user.full_name}
                                    </span>
                                    <ChevronDown size={14} className="text-gray-500" />
                                </button>

                                {profileOpen && (
                                    <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50`}>
                                        <div className={`px-4 py-2 border-b border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : ''}`}>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.full_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                            {isAdmin && (
                                                <span className={`inline-flex items-center gap-1 mt-1 text-xs font-medium text-teal-600 dark:text-teal-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <Shield size={10} /> {isRTL ? "مسؤول" : "Admin"}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <User size={14} /> {t.nav.profile || "My Profile"}
                                        </Link>
                                        <Link
                                            href="/dashboard/my-requests"
                                            onClick={() => setProfileOpen(false)}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <PlusCircle size={14} /> {t.nav.my_requests}
                                        </Link>
                                        <Link
                                            href="/dashboard/favorites"
                                            onClick={() => setProfileOpen(false)}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <Heart size={14} /> {t.nav.favorites}
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setProfileOpen(false)}
                                                className={`flex items-center gap-2 px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                            >
                                                <Shield size={14} /> {t.nav.admin_panel || "Admin Panel"}
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                                            <form action="/auth/signout" method="post">
                                                <button
                                                    type="submit"
                                                    className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                                >
                                                    <LogOut size={14} /> {t.nav.sign_out}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                >
                                    {t.auth.sign_in}
                                </Link>
                                <Link
                                    href="/auth/sign-up"
                                    className="btn-primary text-sm"
                                >
                                    {t.auth.sign_up}
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
                    {[...navLinks, ...userLinks, ...adminLinks].map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                    : "text-gray-700 dark:text-gray-300"
                                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
