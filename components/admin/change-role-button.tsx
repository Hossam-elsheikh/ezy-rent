"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Swal from "sweetalert2";

interface ChangeRoleButtonProps {
    userId: string;
    currentRole: string;
    isSelf: boolean;
}

export function ChangeRoleButton({ userId, currentRole, isSelf }: ChangeRoleButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const toggle = async () => {
        if (isSelf) return;
        const newRole = currentRole === "admin" ? "user" : "admin";

        const result = await Swal.fire({
            title: t.admin.alerts.change_role_title,
            text: `${t.admin.alerts.change_role_desc} ${newRole}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4f46e5",
            cancelButtonColor: "#6b7280",
            confirmButtonText: t.admin.alerts.yes_change,
            cancelButtonText: t.admin.alerts.cancel
        });
        if (!result.isConfirmed) return;
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
