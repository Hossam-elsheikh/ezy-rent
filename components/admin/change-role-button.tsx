"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, User, Loader2 } from "lucide-react";

interface ChangeRoleButtonProps {
    userId: string;
    currentRole: string;
    isSelf: boolean;
}

export function ChangeRoleButton({ userId, currentRole, isSelf }: ChangeRoleButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggle = async () => {
        if (isSelf) return;
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Change this user's role to ${newRole}?`)) return;
        setLoading(true);
        const supabase = createClient();
        await supabase.from("users").update({ role: newRole }).eq("id", userId);
        router.refresh();
        setLoading(false);
    };

    if (isSelf) return null;

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={`Make ${currentRole === "admin" ? "user" : "admin"}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
            {loading ? (
                <Loader2 size={15} className="animate-spin" />
            ) : currentRole === "admin" ? (
                <User size={15} />
            ) : (
                <Shield size={15} />
            )}
        </button>
    );
}
