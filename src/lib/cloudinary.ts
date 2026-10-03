import { createHash, randomUUID } from "node:crypto";

type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };
type UploadedImage = { url: string; publicId: string };

function config(): CloudinaryConfig | null {
  const value = process.env.CLOUDINARY_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "cloudinary:" || !url.username || !url.password || !url.hostname) return null;
    return { cloudName: url.hostname, apiKey: decodeURIComponent(url.username), apiSecret: decodeURIComponent(url.password) };
  } catch { return null; }
}

export function isCloudinaryConfigured() { return config() !== null; }

/**
 * Deletes an uploaded image that is no longer referenced. Best effort: a failure is logged,
 * never thrown, because the database change it follows has already been saved.
 */
export async function deleteProductImage(publicId: string) {
  const credentials = config();
  if (!credentials) return;
  try {
    const timestamp = String(Math.floor(Date.now() / 1000));
    // Signed parameters, sorted alphabetically, followed by the API secret (Cloudinary's signing scheme).
    const signature = createHash("sha1").update(`public_id=${publicId}&timestamp=${timestamp}${credentials.apiSecret}`).digest("hex");
    const body = new FormData();
    body.append("public_id", publicId);
    body.append("timestamp", timestamp);
    body.append("api_key", credentials.apiKey);
    body.append("signature", signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/destroy`, { method: "POST", body, cache: "no-store" });
    if (!response.ok) console.error("Cloudinary image deletion failed", publicId, response.status);
  } catch (error) {
    console.error("Cloudinary image deletion failed", publicId, error);
  }
}

export async function uploadProductImage(file: File): Promise<UploadedImage> {
  const credentials = config();
  if (!credentials) throw new Error("Cloudinary is not configured.");
  const body = new FormData();
  body.append("file", file);
  body.append("folder", process.env.CLOUDINARY_PRODUCT_FOLDER ?? "caring-chemistry/products");
  body.append("public_id", `product-${randomUUID()}`);
  body.append("resource_type", "image");

  const authorization = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString("base64");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`, { method: "POST", headers: { Authorization: `Basic ${authorization}` }, body, cache: "no-store" });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.secure_url || !result?.public_id) throw new Error("Cloudinary rejected the image upload.");
  return { url: result.secure_url, publicId: result.public_id };
}
