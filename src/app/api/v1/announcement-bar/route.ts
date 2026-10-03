import { AnnouncementDirection, Role } from "@/generated/prisma/client";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
import { announcementLinkSchema } from "@/lib/announcement";

const schema = z.object({
  isActive: z.boolean().optional(),
  content: z.string().min(1).max(500),
  speed: z.number().int().positive().max(1000).optional(),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  direction: z.enum(["left", "right"]).optional(),
  link: announcementLinkSchema.optional(),
});

export async function GET(request: Request) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);

    return ok(
      await prisma.announcementBar.findMany({
        orderBy: { updatedAt: "desc" },
      })
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SOCIAL_TEAM]);
    const input = schema.parse(await request.json());
    const announcementBar = await prisma.$transaction(async (tx) => {
      if (input.isActive) await tx.announcementBar.updateMany({ where: { isActive: true }, data: { isActive: false } });
      return tx.announcementBar.create({
        data: {
          id: randomUUID(),
          content: input.content,
          isActive: input.isActive,
          speed: input.speed,
          background: input.background,
          textColor: input.textColor,
          direction: input.direction === "right" ? AnnouncementDirection.RIGHT : input.direction === "left" ? AnnouncementDirection.LEFT : undefined,
          link: input.link,
        },
      });
    });

    await audit(user.id, "ANNOUNCEMENT_BAR_CREATED", "AnnouncementBar", announcementBar.id, request);

    return ok(announcementBar, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
