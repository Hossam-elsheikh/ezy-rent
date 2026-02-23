"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Swal from "sweetalert2";

export function DeleteUserButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: t.admin.alerts.delete_user_title,
            text: t.admin.alerts.delete_user_desc,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: t.admin.alerts.yes_delete_user,
            cancelButtonText: t.admin.alerts.cancel
        });
        if (!result.isConfirmed) return;
        setLoading(true);
        const supabase = createClient();
        await supabase.from("users").delete().eq("id", userId);
        router.refresh();
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
    );
}
