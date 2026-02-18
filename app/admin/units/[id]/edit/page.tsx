import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { EditUnitClient } from "@/components/edit-unit-client";
import { redirect, notFound } from "next/navigation";

interface EditUnitPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditUnitPage({ params }: EditUnitPageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    if (user.role !== "admin") redirect("/");

    const supabase = await createClient();
    const { data: unit } = await supabase.from("units").select("*").eq("id", id).single();
    if (!unit) notFound();

    return <EditUnitClient user={user} unit={unit} />;
}
