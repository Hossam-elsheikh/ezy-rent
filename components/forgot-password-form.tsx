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
import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/context/language-context";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props} dir={isRTL ? "rtl" : "ltr"}>
      {success ? (
        <Card className={isRTL ? "text-right" : ""}>
          <CardHeader>
            <CardTitle className="text-2xl">{t.auth_pages.reset_link_sent}</CardTitle>
            <CardDescription>{t.auth_pages.reset_link_desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isRTL ? "ستتلقى رسالة إعادة تعيين كلمة المرور إذا كنت قد سجلت باستخدام بريدك الإلكتروني." : "If you registered using your email and password, you will receive a password reset email."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className={isRTL ? "text-right" : ""}>
          <CardHeader>
            <CardTitle className="text-2xl">{t.auth_pages.forgot_password_title}</CardTitle>
            <CardDescription>
              {t.auth_pages.forgot_password_desc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className={isRTL ? "text-right" : ""}>{t.auth.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (isRTL ? "جاري الإرسال..." : "Sending...") : (isRTL ? "إرسال رابط التعيين" : "Send reset email")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t.auth.already_have_account}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  {t.auth.sign_in}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
