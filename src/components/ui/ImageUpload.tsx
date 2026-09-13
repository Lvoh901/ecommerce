"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import { ImagePlus, Loader2 } from "lucide-react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { notify } from "@/lib/notify";

/**
 * UploadThing image field with live preview.
 * Used in admin listing/category forms; stores the hosted URL in the form.
 */
export default function ImageUpload({
  value,
  onChange,
  endpoint = "storeImage",
}: {
  value: string;
  onChange: (url: string) => void;
  endpoint?: "storeImage" | "avatar";
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" sizes="400px" />
        </div>
      ) : (
        <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No image yet
        </div>
      )}

      <div className="flex items-center gap-2">
        <UploadButton<OurFileRouter, "storeImage" | "avatar">
          endpoint={endpoint}
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false);
            const url = res?.[0]?.ufsUrl;
            if (url) {
              onChange(url);
              notify.toast("Image uploaded");
            }
          }}
          onUploadError={(error) => {
            setUploading(false);
            notify.error("Upload failed", error.message);
          }}
          appearance={{
            button:
              "ut-ready:bg-[#FF4500] ut-uploading:bg-gray-400 rounded-xl text-sm font-bold px-4 py-2 ut-ready:hover:brightness-110 transition-all",
            container: "w-auto",
            allowedContent: "hidden",
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading || uploading)
                return (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
                  </span>
                );
              if (ready)
                return (
                  <span className="flex items-center gap-1.5">
                    <ImagePlus className="w-4 h-4" /> {value ? "Replace image" : "Upload image"}
                  </span>
                );
              return "Loading…";
            },
          }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL (/…jpg)"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none text-sm"
        />
      </div>
    </div>
  );
}
