import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminUsersClient } from "@/components/admin-users-client";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();

    const { data: users } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    return <AdminUsersClient user={user} users={users || []} />;
}
