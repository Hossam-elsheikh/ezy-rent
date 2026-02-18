import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminRequestsClient } from "@/components/admin-requests-client";
import { redirect } from "next/navigation";

interface AdminRequestsPageProps {
    searchParams: Promise<{ status?: string }>;
}

export default async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
    const params = await searchParams;
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();

    let query = supabase
        .from("unit_requests")
        .select("*, requester:requester_id(full_name, email, phone)")
        .order("created_at", { ascending: false });

    if (params.status) {
        query = query.eq("status", params.status);
    }

    const { data: requests } = await query;

    return <AdminRequestsClient user={user} requests={requests || []} status={params.status} />;
}
