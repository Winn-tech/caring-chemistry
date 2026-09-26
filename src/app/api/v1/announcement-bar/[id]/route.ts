import { AnnouncementDirection, Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";

const schema = z.object({
  isActive: z.boolean().optional(),
  content: z.string().min(1).max(500).optional(),
  speed: z.number().int().positive().max(1000).optional(),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  direction: z.enum(["left", "right"]).optional(),
  link: z.string().url().nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
    const { id } = await params;
    const input = schema.parse(await request.json());
    const announcementBar = await prisma.$transaction(async (tx) => {
      if (input.isActive) await tx.announcementBar.updateMany({ where: { isActive: true, id: { not: id } }, data: { isActive: false } });
      return tx.announcementBar.update({
        where: { id },
        data: { ...input, direction: input.direction === "right" ? AnnouncementDirection.RIGHT : input.direction === "left" ? AnnouncementDirection.LEFT : undefined },
      });
    });

    await audit(user.id, "ANNOUNCEMENT_BAR_UPDATED", "AnnouncementBar", id, request);

    return ok(announcementBar);
  } catch (error) {
    return errorResponse(error);
  }
}
