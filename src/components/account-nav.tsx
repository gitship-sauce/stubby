import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function AccountNav() {
  const user = await currentUser();
  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="hidden font-mono sm:inline">{user.email}</span>
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm font-bold">
      <Link href="/login" className="rounded-xl px-3 py-1.5 underline decoration-2 underline-offset-2">
        Log in
      </Link>
      <Link href="/signup" className="rounded-xl border-[3px] border-ink bg-butter px-3 py-1">
        Sign up
      </Link>
    </div>
  );
}
