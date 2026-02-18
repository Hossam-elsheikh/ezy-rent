"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "@/context/language-context";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t, isRTL } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props} dir={isRTL ? "rtl" : "ltr"}>
      <Card className={isRTL ? "text-right" : ""}>
        <CardHeader>
          <CardTitle className="text-2xl">{t.auth_pages.update_password_title}</CardTitle>
          <CardDescription>
            {t.auth_pages.update_password_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className={isRTL ? "text-right" : ""}>{isRTL ? "كلمة المرور الجديدة" : "New password"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={isRTL ? "text-right" : ""}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? t.unit.save_changes : "Save new password")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
