import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();

    const [
        { count: totalUnits },
        { count: totalUsers },
        { count: pendingRequests },
        { count: approvedRequests },
        { count: rejectedRequests },
    ] = await Promise.all([
        supabase.from("units").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("unit_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("unit_requests").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("unit_requests").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    ]);

    // Recent requests
    const { data: recentRequests } = await supabase
        .from("unit_requests")
        .select("*, requester:requester_id(full_name, email)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <AdminDashboardClient
            user={user}
            stats={{
                totalUnits: totalUnits || 0,
                totalUsers: totalUsers || 0,
                pendingRequests: pendingRequests || 0,
                approvedRequests: approvedRequests || 0,
                rejectedRequests: rejectedRequests || 0,
            }}
            recentRequests={recentRequests || []}
        />
    );
}
