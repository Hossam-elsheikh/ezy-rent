"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RequestReviewActionsProps {
    requestId: string;
}

export function RequestReviewActions({ requestId }: RequestReviewActionsProps) {
    const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const router = useRouter();

    const handleAction = async (action: "approve" | "reject") => {
        if (action === "reject" && !adminNote.trim()) {
            alert("Please provide a note explaining the rejection.");
            return;
        }
        setLoading(action);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const newStatus = action === "approve" ? "approved" : "rejected";

        const { data: reqData } = await supabase
            .from("unit_requests")
            .update({
                status: newStatus,
                admin_note: adminNote || null,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId)
            .select("*")
            .single();

        // If approved, create the actual unit
        if (action === "approve" && reqData) {
            await supabase.from("units").insert({
                owner_id: reqData.requester_id,
                title: reqData.title,
                details: reqData.details,
                image_path: reqData.image_path,
                media_link: reqData.media_link,
                persons: reqData.persons,
                price: reqData.price,
                negotiable: reqData.negotiable,
                country: reqData.country,
                city: reqData.city,
                district: reqData.district,
                address: reqData.address,
                available: true,
                available_at: reqData.available_at,
                status: "approved",
            });
        }

        setLoading(null);
        router.push("/admin/requests");
        router.refresh();
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Review Request</h3>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Admin Note (required for rejection)
                </label>
                <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for the requester..."
                    className="input-field resize-none text-sm"
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => handleAction("approve")}
                    disabled={loading !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors disabled:opacity-50"
                >
                    {loading === "approve" ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <CheckCircle size={15} />
                    )}
                    Approve
                </button>
                <button
                    onClick={() => handleAction("reject")}
                    disabled={loading !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors disabled:opacity-50"
                >
                    {loading === "reject" ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <XCircle size={15} />
                    )}
                    Reject
                </button>
            </div>
        </div>
    );
}
