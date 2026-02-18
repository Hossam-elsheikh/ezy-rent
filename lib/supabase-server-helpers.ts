import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/lib/types";
import { connection } from "next/server";

export async function getCurrentUser(): Promise<UserProfile | null> {
    await connection();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    return data as UserProfile | null;
}

export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "admin";
}
