import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { UnitsClient } from "@/components/units-client";

interface UnitsPageProps {
    searchParams: Promise<{
        search?: string;
        country?: string;
        city?: string;
        district?: string;
        minPrice?: string;
        maxPrice?: string;
        persons?: string;
        available?: string;
    }>;
}

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const user = await getCurrentUser();

    // Build query
    let query = supabase
        .from("units")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,details.ilike.%${params.search}%,city.ilike.%${params.search}%,district.ilike.%${params.search}%`);
    }
    if (params.country) query = query.eq("country", params.country);
    if (params.city) query = query.eq("city", params.city);
    if (params.district) query = query.eq("district", params.district);
    if (params.minPrice) query = query.gte("price", Number(params.minPrice));
    if (params.maxPrice) query = query.lte("price", Number(params.maxPrice));
    if (params.persons) query = query.gte("persons", Number(params.persons));
    if (params.available === "true") query = query.eq("available", true);

    const { data: units } = await query;

    // Get filter options
    const { data: countriesData } = await supabase
        .from("units")
        .select("country")
        .eq("status", "approved");
    const { data: citiesData } = await supabase
        .from("units")
        .select("city")
        .eq("status", "approved");
    const { data: districtsData } = await supabase
        .from("units")
        .select("district")
        .eq("status", "approved")
        .not("district", "is", null);

    const countries = [...new Set(countriesData?.map((r) => r.country) || [])].sort();
    const cities = [...new Set(citiesData?.map((r) => r.city) || [])].sort();
    const districts = [...new Set(districtsData?.map((r) => r.district).filter(Boolean) || [])].sort();

    // Get user favorites
    const favorites: string[] = [];
    if (user) {
        const { data: favData } = await supabase
            .from("favorites")
            .select("unit_id")
            .eq("user_id", user.id);
        favData?.forEach((f) => favorites.push(f.unit_id));
    }

    return (
        <UnitsClient
            user={user}
            units={units || []}
            countries={countries}
            cities={cities}
            districts={districts}
            favorites={favorites}
            params={params}
        />
    );
}
