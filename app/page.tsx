import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { Unit } from "@/lib/types";
import { HomeClient } from "@/components/home/home-client";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  // Fetch featured units (latest 6 approved)
  const { data: featuredUnits } = await supabase
    .from("units")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch stats
  const { count: totalUnits } = await supabase
    .from("units")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { data: countriesData } = await supabase
    .from("units")
    .select("country")
    .eq("status", "approved");

  const totalCountries = new Set(countriesData?.map(c => c.country) || []).size;

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
    <HomeClient
      user={user}
      featuredUnits={(featuredUnits || []) as Unit[]}
      totalUnits={totalUnits || 0}
      totalCountries={totalCountries || 0}
      favorites={favorites}
    />
  );
}
