import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminEditUserClient } from "@/components/admin-edit-user-client";
import { redirect, notFound } from "next/navigation";

interface EditUserPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminEditUserPage({ params }: EditUserPageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") redirect("/auth/login");

    const supabase = await createClient();
    const { data: targetUser } = await supabase.from("users").select("*").eq("id", id).single();

    if (!targetUser) notFound();

    return <AdminEditUserClient user={user} targetUser={targetUser} />;
}
