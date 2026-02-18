"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, User } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ProfileFormProps {
    user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        full_name: user.full_name || "",
        phone: user.phone || "",
        nationality: user.nationality || "",
        age: user.age || "",
        gender: user.gender || "",
        profession: user.profession || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const supabase = createClient();
            const { error: updateError } = await supabase
                .from("users")
                .update({
                    full_name: form.full_name,
                    phone: form.phone || null,
                    nationality: form.nationality || null,
                    age: form.age ? Number(form.age) : null,
                    gender: form.gender || null,
                    profession: form.profession || null,
                })
                .eq("id", user.id);

            if (updateError) throw updateError;
            setSuccess(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm">
                    {t.profile.update_success}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.phone}</label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.nationality}</label>
                    <input
                        type="text"
                        value={form.nationality}
                        onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                        placeholder={t.profile.nationality_placeholder}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.age}</label>
                    <input
                        type="number"
                        min={18}
                        max={120}
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
                        <option value="">{t.profile.prefer_not_to_say}</option>
                        <option value="male">{t.profile.male}</option>
                        <option value="female">{t.profile.female}</option>
                        <option value="other">{t.profile.other}</option>
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.profile.profession}</label>
                    <input
                        type="text"
                        value={form.profession}
                        onChange={(e) => setForm({ ...form, profession: e.target.value })}
                        placeholder={t.profile.profession_placeholder}
                        className="input-field"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? t.profile.saving : t.unit.save_changes}
            </button>
        </form>
    );
}
