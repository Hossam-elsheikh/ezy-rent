"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/context/language-context";

export function AdminUserForm({
    mode,
    initialData
}: {
    mode: "create" | "edit",
    initialData?: any
}) {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        full_name: initialData?.full_name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        nationality: initialData?.nationality || "",
        age: initialData?.age || "",
        gender: initialData?.gender || "male",
        profession: initialData?.profession || "",
        role: initialData?.role || "user",
        password: "" // Only used for create
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            if (mode === "create") {
                const { data, error: authError } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: {
                            full_name: form.full_name,
                            role: form.role
                        }
                    }
                });
                if (authError) throw authError;

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from("users")
                        .update({
                            phone: form.phone || null,
                            nationality: form.nationality || null,
                            age: form.age ? Number(form.age) : null,
                            gender: form.gender || null,
                            profession: form.profession || null,
                        })
                        .eq("id", data.user.id);
                    if (profileError) throw profileError;
                }
            } else {
                const { error: updateError } = await supabase
                    .from("users")
                    .update({
                        full_name: form.full_name,
                        phone: form.phone || null,
                        nationality: form.nationality || null,
                        age: form.age ? Number(form.age) : null,
                        gender: form.gender || null,
                        profession: form.profession || null,
                        role: form.role,
                    })
                    .eq("id", initialData.id);

                if (updateError) throw updateError;
            }

            router.push("/admin/users");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.full_name} *</label>
                    <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.auth.email} *</label>
                    <input
                        type="email"
                        required
                        disabled={mode === "edit"}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field disabled:opacity-50"
                    />
                </div>

                {mode === "create" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.auth.password} *</label>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="input-field"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{isRTL ? "الدور" : "Role"}</label>
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="input-field"
                    >
                        <option value="user">{isRTL ? "مستخدم" : "User"}</option>
                        <option value="admin">{t.admin.dashboard_title.split(' ')[0]}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.phone}</label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.nationality}</label>
                    <input
                        type="text"
                        value={form.nationality}
                        onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.age}</label>
                    <input
                        type="number"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.gender}</label>
                    <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="input-field"
                    >
                        <option value="male">{t.profile.male}</option>
                        <option value="female">{t.profile.female}</option>
                        <option value="other">{t.profile.other}</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.profession}</label>
                    <input
                        type="text"
                        value={form.profession}
                        onChange={(e) => setForm({ ...form, profession: e.target.value })}
                        className="input-field"
                    />
                </div>
            </div>

            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {mode === "create" ? (isRTL ? "إنشاء مستخدم" : "Create User") : (isRTL ? "تحديث المستخدم" : "Update User")}
                </button>
                <Link
                    href="/admin/users"
                    className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-center"
                >
                    {isRTL ? "إلغاء" : "Cancel"}
                </Link>
            </div>
        </form>
    );
}
