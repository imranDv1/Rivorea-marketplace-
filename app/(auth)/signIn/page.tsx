import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/icons/Logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-20"
          />
          <h1 className="font-bold text-lg">Create your account</h1>
          <p>
            Alrady have account ? go <Link href="/signIn">sign in</Link>
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default page;
