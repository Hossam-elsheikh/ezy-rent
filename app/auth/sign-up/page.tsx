import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Building2 className="text-white" size={20} />
          </div>
          <span className="text-2xl font-bold gradient-text">EzyRent</span>
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}
