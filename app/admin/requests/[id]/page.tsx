import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { RequestDetailClient } from "@/components/request-detail-client";
import { redirect, notFound } from "next/navigation";

interface RequestDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();
    const { data: req } = await supabase
        .from("unit_requests")
        .select("*, requester:requester_id(*)")
        .eq("id", id)
        .single();

    if (!req) notFound();

    return <RequestDetailClient user={user} req={req} id={id} />;
}
