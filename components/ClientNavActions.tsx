// ClientNavActions.tsx (Client Component)
"use client";

import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "./UserDropdown";

import { buttonVariants } from "./ui/button";

import Link from "next/link";

interface iAppProps {
 
  admin: boolean;
}

export default function ClientNavActions({admin }:iAppProps) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="flex items-center gap-3">

      {/* Cart Sheet */}
 

      {/* User / Auth */}
      {isPending ? null : session ? (
        <UserDropdown email={session.user.email} image={`${session.user.image}`} name={session.user.name} admin={admin} />
      ) : (
        <Link href="/login" className={buttonVariants()}>Login</Link>
      )}
    </div>
  );
}
