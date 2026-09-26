import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma/client";
import { getAdminSession } from "@/lib/auth";
import { uploadProductImage } from "@/lib/cloudinary";
import { audit } from "@/lib/security";

export const runtime = "nodejs";
const maxBytes = Number(process.env.MAX_IMAGE_UPLOAD_BYTES ?? 10 * 1024 * 1024);
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getAdminSession();
  if (!user || (user.role !== Role.GENERAL_ADMIN && user.role !== Role.SALES_TEAM && user.role !== Role.SOCIAL_TEAM)) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Select an image to upload." }, { status: 422 });
    if (!supportedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPEG, PNG, or WebP image." }, { status: 422 });
    if (file.size === 0 || file.size > maxBytes) return NextResponse.json({ error: "Image must be between 1 byte and 10 MB." }, { status: 422 });
    if (!(await hasExpectedImageSignature(file))) return NextResponse.json({ error: "The selected file is not a valid image." }, { status: 422 });

    const image = await uploadProductImage(file);
    await audit(user.id, "PRODUCT_IMAGE_UPLOADED", "ProductImage", image.publicId, request, { bytes: file.size, mimeType: file.type });
    return NextResponse.json({ data: image }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Product image upload failed", error);
    return NextResponse.json({ error: "Image upload is unavailable. Please try again later." }, { status: 503 });
  }
}

async function hasExpectedImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  return file.type === "image/webp" && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
}
