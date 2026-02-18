export function formatPrice(price: number, lang: "en" | "ar" = "en") {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: lang === "ar" ? "EGP" : "USD",
        maximumFractionDigits: 0,
    }).format(price);
}

export function formatDate(date: string, lang: "en" | "ar" = "en") {
    return new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function getImageUrl(supabaseUrl: string, path: string | null) {
    if (!path) return "/placeholder-unit.jpg";
    if (path.startsWith("http")) return path;
    return `${supabaseUrl}/storage/v1/object/public/units_images/${path}`;
}
