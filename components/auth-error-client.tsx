"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export function AuthErrorClient() {
    const { t, isRTL } = useLanguage();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10" dir={isRTL ? "rtl" : "ltr"}>
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card className={isRTL ? "text-right" : ""}>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t.auth_pages.error_title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <p className="text-sm text-muted-foreground">
                                    {t.auth_pages.code_error}: {error}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t.auth_pages.unspecified_error}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
