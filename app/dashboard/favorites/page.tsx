import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { FavoritesClient } from "@/components/favorites-client";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    const supabase = await createClient();

    const { data: favorites } = await supabase
        .from("favorites")
        .select("*, unit:unit_id(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return <FavoritesClient user={user} favorites={favorites || []} />;
}
