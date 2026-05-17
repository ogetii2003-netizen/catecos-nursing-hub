import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

const DEFAULT_SETTINGS: Record<string, string> = {
  phone1: "0758 867 235",
  phone2: "0785 466 886",
  email: "njerimuringo@gmail.com",
  address: "Pema Community Hospital, Utawala, Nairobi",
  hours: "24 Hours, 7 Days a Week",
  hero_title: "Professional nursing care, comfort of home.",
  hero_subtitle: "We bring hospital-quality care directly to your doorstep. Compassionate, qualified nurses available 24/7 for you and your loved ones.",
  about_text: "Catecos Nursing Hub is a premier home nursing agency based at Pema Community Hospital, Utawala. We provide compassionate, professional nursing care delivered directly to your home.",
  services: JSON.stringify([
    { id: "1", title: "Home Nursing Care", description: "Professional nursing care delivered at home by qualified nurses.", icon: "Heart" },
    { id: "2", title: "Elderly Care", description: "Dedicated care for elderly patients with compassion and dignity.", icon: "Users" },
    { id: "3", title: "Post-Surgery Care", description: "Expert recovery support after surgical procedures.", icon: "Activity" },
    { id: "4", title: "Maternity Care", description: "Pre and post-natal care for mothers and newborns.", icon: "Baby" },
    { id: "5", title: "Physiotherapy", description: "Rehabilitation and physical therapy in the comfort of home.", icon: "Zap" },
    { id: "6", title: "Medical Checkups", description: "Regular health monitoring and vital sign assessment.", icon: "Stethoscope" },
  ]),
  team: JSON.stringify([
    { id: "1", name: "Dr. Jane Mwangi", role: "Lead Nurse", bio: "10+ years experience in home nursing care.", image: "" },
    { id: "2", name: "Nurse Peter Otieno", role: "Senior Nurse", bio: "Specialised in elderly and post-surgery care.", image: "" },
    { id: "3", name: "Nurse Faith Njeri", role: "Maternity Nurse", bio: "Expert in pre and post-natal care.", image: "" },
  ]),
  testimonials: JSON.stringify([
    { id: "1", name: "Mary W.", text: "Catecos Nursing Hub provided excellent care for my mother. The nurses were professional and kind.", rating: 5, visible: true },
    { id: "2", name: "John K.", text: "After my surgery, the home nursing service was a lifesaver. Highly recommend!", rating: 5, visible: true },
    { id: "3", name: "Grace N.", text: "Very professional team. They arrived on time and took great care of my father.", rating: 5, visible: true },
  ]),
};

// GET all settings
router.get("/settings", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable);
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  rows.forEach(r => { map[r.key] = r.value; });
  res.json(map);
});

// PUT a single setting
router.put("/settings/:key", requireAdmin, async (req, res): Promise<void> => {
  const key = req.params.key as string;
  const { value } = req.body as { value: string };

  if (value === undefined || value === null) {
    res.status(400).json({ error: "value is required" });
    return;
  }

  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
  if (existing.length > 0) {
    await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key));
  } else {
    await db.insert(siteSettingsTable).values({ key, value });
  }

  req.log.info({ key }, "Setting updated");
  res.json({ key, value });
});

// GET public settings (no auth needed — for the site to read)
router.get("/settings/public", async (_req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable);
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  rows.forEach(r => { map[r.key] = r.value; });
  // Only expose safe public keys
  const publicKeys = ["phone1", "phone2", "email", "address", "hours", "hero_title", "hero_subtitle", "about_text", "services", "team", "testimonials"];
  const pub: Record<string, string> = {};
  publicKeys.forEach(k => { if (map[k]) pub[k] = map[k]; });
  res.json(pub);
});

export default router;
