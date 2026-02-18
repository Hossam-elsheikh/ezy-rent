"use client";

import { useLanguage } from "@/context/language-context";
import { Navbar } from "@/components/navbar";
import { UnitForm } from "@/components/unit-form";
import { UserProfile } from "@/lib/types";
import { PlusCircle } from "lucide-react";

interface ListUnitClientProps {
    user: UserProfile;
}

export function ListUnitClient({ user }: ListUnitClientProps) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <PlusCircle size={20} className="text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard.list_new_unit}</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isRTL ? "أضف تفاصيل وحدتك أدناه. سيتم مراجعة طلبك من قبل فريق الإدارة قبل نشره." : "Fill in the details below. Your listing will be reviewed by our admin team before going live."}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <UnitForm mode="create" isRequest={true} />
                </div>
            </div>
        </div>
    );
}
