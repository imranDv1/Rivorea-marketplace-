
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import Image from "next/image";
import Link from "next/link";
import GoogleSignButton from "./GoogleSignButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function Page() {

    const session = await auth.api.getSession({
    headers : await headers()
  })

  if(session){
    return  redirect("/")
  }


  return (
    <MaxWidthWrapper className="mt-20">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Logo & title */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-20"
          />
          <h1 className="font-bold text-lg">Welcom to Rivorea</h1>
          <p className="text-muted-foreground">
            Already have an account? Go <Link href="/signIn">sign in</Link>
          </p>
        </div>

      <GoogleSignButton/>

      </div>
    </MaxWidthWrapper>
  );
}

export default Page;
