"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteUserButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
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
