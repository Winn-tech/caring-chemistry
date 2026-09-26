"use client";

import { useRef, useState } from "react";

export function ProductImageUpload({ initialUrl, initialPublicId }: { initialUrl?: string; initialPublicId?: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [publicId, setPublicId] = useState(initialPublicId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    const file = input.current?.files?.[0];
    if (!file) return;
    setError(null); setUploading(true);
    try {
      const body = new FormData(); body.append("image", file);
      const response = await fetch("/admin/uploads/images", { method: "POST", body, credentials: "same-origin" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Image upload failed.");
      setUrl(result.data.url); setPublicId(result.data.publicId);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed."); }
    finally { setUploading(false); }
  }

  return <div className="mt-4"><input name="imageUrl" type="hidden" value={url} /><input name="imagePublicId" type="hidden" value={publicId} /><label className="block text-sm font-medium text-primary-800" htmlFor="product-image">Upload image</label><div className="mt-2 flex flex-wrap items-center gap-3"><input accept="image/jpeg,image/png,image/webp" className="block max-w-full text-sm text-primary-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-800 hover:file:bg-primary-200" id="product-image" ref={input} type="file" onChange={upload} /><span className="text-xs text-primary-500">JPEG, PNG, or WebP · max 10 MB</span></div>{uploading && <p className="mt-3 text-sm text-primary-600">Uploading securely…</p>}{error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}{url && <div className="mt-4 flex items-start gap-4"><img alt="Product upload preview" className="h-24 w-24 rounded-lg border border-primary-100 object-cover" src={url} /><button className="text-sm font-medium text-primary-700 hover:text-primary-950" type="button" onClick={() => { setUrl(""); setPublicId(""); if (input.current) input.current.value = ""; }}>Remove image</button></div>}</div>;
}
