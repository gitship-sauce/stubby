"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
      }}
      className="rounded-xl border-[3px] border-ink bg-white px-3 py-1 font-bold"
    >
      Log out
    </button>
  );
}
