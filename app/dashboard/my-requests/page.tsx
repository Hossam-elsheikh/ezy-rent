import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { MyRequestsClient } from "@/components/my-requests-client";
import { redirect } from "next/navigation";

export default async function MyRequestsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    const supabase = await createClient();

    const { data: requests } = await supabase
        .from("unit_requests")
        .select("*")
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false });

    return <MyRequestsClient user={user} requests={requests || []} />;
}
