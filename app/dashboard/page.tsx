import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { DashboardClient } from "@/components/dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    const supabase = await createClient();

    const { count: favCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    const { count: reqCount } = await supabase
        .from("unit_requests")
        .select("*", { count: "exact", head: true })
        .eq("requester_id", user.id);

    const { count: pendingCount } = await supabase
        .from("unit_requests")
        .select("*", { count: "exact", head: true })
        .eq("requester_id", user.id)
        .eq("status", "pending");

    return (
        <DashboardClient
            user={user}
            favCount={favCount || 0}
            reqCount={reqCount || 0}
            pendingCount={pendingCount || 0}
        />
    );
}
