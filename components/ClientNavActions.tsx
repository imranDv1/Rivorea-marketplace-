// ClientNavActions.tsx (Client Component)
"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "./ui/themeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import Cart from "./ui/cart";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function ClientNavActions() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="flex items-center gap-3">

      {/* Cart Sheet */}
 

      {/* User / Auth */}
      {isPending ? null : session ? (
        <UserDropdown email={session.user.email} image={`${session.user.image}`} name={session.user.name} />
      ) : (
        <Link href="/login" className={buttonVariants()}>Login</Link>
      )}
    </div>
  );
}
