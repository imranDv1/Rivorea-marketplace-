// NavBar.tsx (Server Component)
import Image from "next/image";
import Link from "next/link";
import ClientNavActions from "./ClientNavActions"; // ✅ client component
import CartShett from "./cartShett";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export default async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  let roles: { admin: boolean } | null = null;

  if (userId) {
    roles = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        admin: true,
      },
    });
  }

  return (
    <div className="sticky w-full h-16 py-4 md:px-10">
      <header className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/logo.png"
              alt="logo"
              width={20}
              height={20}
              className="w-11"
            />
            <h1 className="text-2xl font-bold text-primary">Rivorea.</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/ui-kit">
              <span className="text-lg font-semibold hover:text-primary transition-colors">
                Ui kit
              </span>
            </Link>
            <Link href="/icons">
              <span className="text-lg font-semibold hover:text-primary transition-colors">
                Icons
              </span>
            </Link>
            {roles?.admin && (
              <Link href="/dashboard">
                <span className="text-lg font-semibold hover:text-primary transition-colors">
                  Dashboard
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right section (client component) */}
        <div className="flex items-center gap-3">
          <CartShett />
          <ClientNavActions admin={roles?.admin as boolean} />
        </div>
      </header>
    </div>
  );
}
