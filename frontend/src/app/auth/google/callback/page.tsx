"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../../context/UserContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken  = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role         = params.get("role");
    const redirectTo   = params.get("redirectTo");
    const error        = params.get("error");

    // Handle errors from backend
    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (!accessToken || !role) {
      router.push("/login?error=missing_tokens");
      return;
    }

    // Store tokens — exactly same as your LoginForm
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Set cookies — exactly same as your LoginForm
    document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;

    // Fetch user details and update context
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data.user);
      })
      .catch(console.error)
      .finally(() => {
        // Redirect to their dashboard
        router.push(redirectTo || "/");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
}