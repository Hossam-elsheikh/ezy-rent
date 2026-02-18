"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
    unitId: string;
    initialFavorited: boolean;
    isLoggedIn: boolean;
}

export function FavoriteButton({ unitId, initialFavorited, isLoggedIn }: FavoriteButtonProps) {
    const [favorited, setFavorited] = useState(initialFavorited);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggle = async () => {
        if (!isLoggedIn) {
            router.push("/auth/login");
            return;
        }
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (favorited) {
            await supabase.from("favorites").delete().eq("unit_id", unitId).eq("user_id", user.id);
        } else {
            await supabase.from("favorites").insert({ unit_id: unitId, user_id: user.id });
        }
        setFavorited(!favorited);
        setLoading(false);
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${favorited
                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800"
                }`}
        >
            <Heart size={16} className={favorited ? "fill-rose-500 text-rose-500" : ""} />
            {favorited ? "Saved to Favorites" : "Save to Favorites"}
        </button>
    );
}
