"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

function GoogleSignButton() {
  const [googlePending, startGoogleTransiton] = useTransition();

  const { data: sessiom } = authClient.useSession();

  if (sessiom) return redirect("/");

  async function SignInWithGoogle() {
    startGoogleTransiton(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("You Wilbe redirect....");
          },
          onError: () => {
            toast.error("Internal Server Error ");
          },
        },
      });
    });
  }
  return (
    <div className="w-80 flex flex-col gap-3">
      <Button
        className="w-full"
        variant="secondary"
        disabled={googlePending}
        onClick={SignInWithGoogle}
      >
        {googlePending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Loading ...</span>
          </>
        ) : (
          <>
            <Image
              src="/icons/google.png"
              alt="Google Logo"
              className="size-5" // 48px
              width={100}
              height={100}
            />
            <span className="text-[18px]">Continue with google</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default GoogleSignButton;
