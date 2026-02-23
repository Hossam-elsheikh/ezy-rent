import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import arLocale from "i18n-iso-countries/langs/ar.json";
import { Country } from "country-state-city";

countries.registerLocale(enLocale);
countries.registerLocale(arLocale);

export function getCountryName(isoCode: string, lang: "en" | "ar" = "en"): string {
    return countries.getName(isoCode, lang) || isoCode;
}

/** Derives the ISO 4217 currency from a country ISO code. Fallback: "USD". */
export function getCountryCurrency(isoCode: string): string {
    return Country.getCountryByCode(isoCode)?.currency || "USD";
}

export function formatPrice(price: number, lang: "en" | "ar" = "en", currency = "USD") {
    try {
        return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(price);
    } catch {
        // Fallback if currency code is invalid
        return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(price);
    }
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
