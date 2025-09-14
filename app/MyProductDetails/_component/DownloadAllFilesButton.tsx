"use client";

import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  productFiles: string[];
}

export default function DownloadButton({ productFiles }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!productFiles || productFiles.length === 0) return;

    productFiles.forEach((url) => {
      // أضف fl_attachment إذا مش موجود
    const downloadUrl = url.includes("fl_attachment")
  ? url
  : `${url}?fl_attachment`;


      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = ""; // يفرض التحميل
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return <Button onClick={handleDownload}>Download All Files</Button>;
}
