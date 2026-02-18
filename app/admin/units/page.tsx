import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminUnitsClient } from "@/components/admin-units-client";
import { redirect } from "next/navigation";

export default async function AdminUnitsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();

    const { data: units } = await supabase
        .from("units")
        .select("*, owner:owner_id(full_name)")
        .order("created_at", { ascending: false });

    return <AdminUnitsClient user={user} units={units || []} />;
}
