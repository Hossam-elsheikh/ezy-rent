import { AuthErrorClient } from "@/components/auth-error-client";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AuthErrorClient />
    </Suspense>
  );
}
