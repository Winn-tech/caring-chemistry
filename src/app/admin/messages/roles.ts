import { Role } from "@/generated/prisma/enums";

/** Who can read the contact inbox. Shared by the page and its actions so the two never disagree. */
export const MESSAGE_ROLES = [Role.GENERAL_ADMIN, Role.SALES_TEAM];
