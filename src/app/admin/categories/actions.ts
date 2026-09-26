"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { z } from "zod";

export type CategoryFormState = { error?: string; success?: string };

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
});

export async function createCategory(_: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = schema.safeParse({ name: formData.get("name"), slug: formData.get("slug") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the category details." };

  try {
    const category = await prisma.category.create({ data: parsed.data });
    await auditServer(user.id, "CATEGORY_CREATED", "Category", category.id, { name: category.name, slug: category.slug });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return { error: "A category with that name or slug already exists." };
    throw error;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  return { success: "Category created." };
}