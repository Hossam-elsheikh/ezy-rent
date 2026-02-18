import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase-server-helpers";
import { formatPrice, formatDate, getImageUrl } from "@/lib/helpers";
import { Navbar } from "@/components/navbar";
import { Unit } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Users, Calendar, DollarSign, ExternalLink,
    ArrowLeft, Heart, BadgeCheck, Clock, User
} from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { UnitDetailClient } from "@/components/unit-detail-client";

interface UnitDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const user = await getCurrentUser();

    const { data: unit } = await supabase
        .from("units")
        .select("*, owner:owner_id(full_name, email, phone)")
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (!unit) notFound();

    return <UnitDetailClient user={user} unit={unit} id={id} />;
}
