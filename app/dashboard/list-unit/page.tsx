import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { ListUnitClient } from "@/components/list-unit-client";
import { redirect } from "next/navigation";

export default async function ListUnitPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    return <ListUnitClient user={user} />;
}
