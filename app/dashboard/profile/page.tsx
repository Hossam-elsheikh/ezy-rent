import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { ProfileClient } from "@/components/profile-client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");

    return <ProfileClient user={user} />;
}
