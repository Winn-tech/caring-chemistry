import { getActiveAnnouncement } from "@/lib/announcement";
import { AnnouncementBarClient } from "./announcement-bar-client";

export async function AnnouncementBar() {
  const announcement = await getActiveAnnouncement();
  return announcement ? <AnnouncementBarClient announcement={announcement} /> : null;
}
