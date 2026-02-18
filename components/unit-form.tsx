"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, MapPin } from "lucide-react";
import { Country, City } from "country-state-city";
import { useLanguage } from "@/context/language-context";

interface UnitFormProps {
    mode: "create" | "edit";
    initialData?: Partial<{
        id: string;
        title: string;
        details: string;
        image_path: string;
        media_link: string;
        persons: number;
        price: number;
        negotiable: boolean;
        country: string;
        city: string;
        district: string;
        address: string;
        available: boolean;
        available_at: string;
    }>;
    onSuccess?: () => void;
    isRequest?: boolean; // if true, submits to unit_requests table
}

export function UnitForm({ mode, initialData, onSuccess, isRequest = false }: UnitFormProps) {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: initialData?.title || "",
        details: initialData?.details || "",
        media_link: initialData?.media_link || "",
        persons: initialData?.persons || 1,
        price: initialData?.price || 0,
        negotiable: initialData?.negotiable || false,
        country: initialData?.country || "",
        city: initialData?.city || "",
        district: initialData?.district || "",
        address: initialData?.address || "",
        available: initialData?.available !== undefined ? initialData.available : true,
        available_at: initialData?.available_at || "",
    });

    const countries = useMemo(() => Country.getAllCountries(), []);

    const selectedCountryCode = useMemo(() => {
        return countries.find(c => c.name === form.country)?.isoCode;
    }, [form.country, countries]);

    const cities = useMemo(() => {
        if (!selectedCountryCode) return [];
        return City.getCitiesOfCountry(selectedCountryCode) || [];
    }, [selectedCountryCode]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            let image_path = initialData?.image_path || null;

            // Upload image if selected
            if (imageFile) {
                const ext = imageFile.name.split(".").pop();
                const fileName = `${user.id}/${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("units_images")
                    .upload(fileName, imageFile, { upsert: true });
                if (uploadError) throw uploadError;
                image_path = fileName;
            }

            if (isRequest) {
                // Submit as a unit request - remove 'available' as it's not in unit_requests table
                const { available, ...requestForm } = form;
                const { error: reqError } = await supabase
                    .from("unit_requests")
                    .insert({
                        ...requestForm,
                        image_path,
                        persons: Number(form.persons),
                        price: Number(form.price),
                        available_at: form.available_at || null,
                        requester_id: user.id
                    });
                if (reqError) throw reqError;
            } else if (mode === "create") {
                const { error: insertError } = await supabase
                    .from("units")
                    .insert({
                        ...form,
                        image_path,
                        persons: Number(form.persons),
                        price: Number(form.price),
                        available_at: form.available_at || null,
                        owner_id: user.id,
                        status: "approved"
                    });
                if (insertError) throw insertError;
            } else {
                const { error: updateError } = await supabase
                    .from("units")
                    .update({
                        ...form,
                        image_path,
                        persons: Number(form.persons),
                        price: Number(form.price),
                        available_at: form.available_at || null,
                    })
                    .eq("id", initialData?.id);
                if (updateError) throw updateError;
            }

            onSuccess?.();
            if (isRequest) router.push("/dashboard/my-requests");
            else router.push("/admin/units");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
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

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.unit.image_label}</label>
                <div className="relative">
                    {imagePreview || initialData?.image_path ? (
                        <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imagePreview || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/units_images/${initialData?.image_path}`}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-teal-400 dark:hover:border-teal-600 transition-colors bg-gray-50 dark:bg-gray-800/50">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t.unit.upload_hint}</span>
                            <span className="text-xs text-gray-400 mt-1">{t.unit.upload_types}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    )}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.title_label} *</label>
                <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={isRTL ? "مثال: شقة غرفتين مريحة في وسط البلد" : "e.g. Cozy 2BR Apartment in Downtown"}
                    className="input-field"
                />
            </div>

            {/* Details */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.details_label}</label>
                <textarea
                    rows={4}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder={isRTL ? "وصف الوحدة والمميزات والقواعد..." : "Describe the unit, amenities, rules..."}
                    className="input-field resize-none"
                />
            </div>

            {/* Media Link */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.media_label}</label>
                <input
                    type="url"
                    value={form.media_link}
                    onChange={(e) => setForm({ ...form, media_link: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="input-field"
                />
            </div>

            {/* Price & Persons */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.price} ($) *</label>
                    <input
                        type="number"
                        required
                        min={0}
                        step={0.01}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.persons} *</label>
                    <input
                        type="number"
                        required
                        min={1}
                        value={form.persons}
                        onChange={(e) => setForm({ ...form, persons: Number(e.target.value) })}
                        className="input-field"
                    />
                </div>
            </div>

            {/* Negotiable & Available */}
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.negotiable}
                        onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t.unit.negotiable}</span>
                </label>
                {!isRequest && (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.available}
                            onChange={(e) => setForm({ ...form, available: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{t.unit.available}</span>
                    </label>
                )}
            </div>

            {/* Available At */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.unit.available_from}</label>
                <input
                    type="date"
                    value={form.available_at}
                    onChange={(e) => setForm({ ...form, available_at: e.target.value })}
                    className="input-field"
                />
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">{t.unit.location}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.home.stats_countries} *</label>
                        <select
                            required
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value, city: "" })}
                            className="input-field"
                        >
                            <option value="">{isRTL ? "اختر الدولة" : "Select Country"}</option>
                            {countries.map((c) => (
                                <option key={c.isoCode} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{isRTL ? "المدينة" : "City"} *</label>
                        <select
                            required
                            disabled={!form.country}
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className="input-field disabled:opacity-50"
                        >
                            <option value="">{isRTL ? "اختر المدينة" : "Select City"}</option>
                            {cities.map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.unit.district}</label>
                        <input
                            type="text"
                            value={form.district}
                            onChange={(e) => setForm({ ...form, district: e.target.value })}
                            placeholder={isRTL ? "مثال: المعادي" : "e.g. Maadi"}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t.unit.address}</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder={isRTL ? "عنوان الشارع" : "Street address"}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
            >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading
                    ? (isRTL ? "جاري الحفظ..." : "Saving...")
                    : isRequest
                        ? t.unit.submit_request
                        : mode === "create"
                            ? (isRTL ? "إنشاء الوحدة" : "Create Unit")
                            : t.unit.save_changes}
            </button>
        </form>
    );
}
