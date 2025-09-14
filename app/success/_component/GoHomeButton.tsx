"use client";

import { Button } from "@/components/ui/button";

export default function GoHomeButton() {
  return (
    <Button
      onClick={() => {
        window.location.href = "/purchase";
      }}
    >
      check my purchase
    </Button>
  );
}
