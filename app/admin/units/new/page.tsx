import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { NewUnitClient } from "@/components/new-unit-client";
import { redirect } from "next/navigation";


export default async function AdminNewUnitPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    return <NewUnitClient user={user} />;
}
