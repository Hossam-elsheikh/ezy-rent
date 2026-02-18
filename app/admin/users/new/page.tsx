import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { AdminNewUserClient } from "@/components/admin-new-user-client";
import { redirect } from "next/navigation";

export default async function AdminNewUserPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") redirect("/auth/login");

    return <AdminNewUserClient user={user} />;
}
