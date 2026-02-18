"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { formatPrice, formatDate } from "@/lib/helpers";
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Users, Pencil, Shield, Mail, Phone, UserPlus } from "lucide-react";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { ChangeRoleButton } from "@/components/admin/change-role-button";

interface AdminUsersClientProps {
    user: UserProfile;
    users: any[];
}

export function AdminUsersClient({ user, users }: AdminUsersClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar user={user} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className={`flex items-center justify-between mb-8 `}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Users size={28} className="text-indigo-500" /> {isRTL ? "المستخدمين" : "Users"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {users?.length || 0} {isRTL ? "مستخدم مسجل" : "registered users"}
                        </p>
                    </div>
                    <Link href="/admin/users/new" className="btn-primary flex items-center gap-2">
                        <UserPlus size={16} /> {isRTL ? "إضافة مستخدم" : "Add User"}
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "المستخدم" : "User"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الاتصال" : "Contact"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "التفاصيل" : "Details"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الدور" : "Role"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "انضم" : "Joined"}</th>
                                    <th className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? "الإجراءات" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users?.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                    {u.full_name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <div className={isRTL ? 'text-right' : ''}>
                                                    <p className="font-medium text-gray-900 dark:text-white">{u.full_name}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-5 py-4 text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : ''}`}>
                                            {u.phone && (
                                                <span className={`flex items-center gap-1 text-xs ${isRTL ? 'justify-end' : ''}`}>
                                                    <Phone size={11} /> {u.phone}
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-5 py-4 text-gray-500 dark:text-gray-400 text-xs ${isRTL ? 'text-right' : ''}`}>
                                            <div className="space-y-0.5">
                                                {u.nationality && <p>🌍 {u.nationality}</p>}
                                                {u.age && <p>{t.profile.age}: {u.age}</p>}
                                                {u.profession && <p>💼 {u.profession}</p>}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${u.role === "admin"
                                                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                }`}>
                                                {u.role === "admin" && <Shield size={10} />}
                                                {u.role === "admin" ? t.admin.title : (isRTL ? "مستخدم" : "user")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                            {formatDate(u.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                                                <ChangeRoleButton userId={u.id} currentRole={u.role} isSelf={u.id === user.id} />
                                                {u.id !== user.id && <DeleteUserButton userId={u.id} />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!users || users.length === 0) && (
                            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
                                <Users size={40} className="mx-auto mb-3 opacity-30" />
                                <p>{isRTL ? "لا يوجد مستخدمين" : "No users found"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
