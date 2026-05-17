import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, insertBookingSchema } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";
import * as z from "zod";

const router: IRouter = Router();

// Public: submit a booking
router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = insertBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
  req.log.info({ bookingId: booking.id }, "New booking created");
  res.status(201).json(booking);
});

// Admin: get all bookings
router.get("/bookings", requireAdmin, async (req, res): Promise<void> => {
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json(bookings);
});

// Admin: booking stats
router.get("/bookings/stats", requireAdmin, async (req, res): Promise<void> => {
  const [total] = await db.select({ count: count() }).from(bookingsTable);
  const [pending] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
  const [contacted] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "contacted"));
  const [confirmed] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
  const [completed] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "completed"));
  const [cancelled] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "cancelled"));

  // Popular services
  const services = await db
    .select({ service: bookingsTable.service, count: count() })
    .from(bookingsTable)
    .groupBy(bookingsTable.service)
    .orderBy(desc(count()));

  res.json({
    total: total?.count ?? 0,
    pending: pending?.count ?? 0,
    contacted: contacted?.count ?? 0,
    confirmed: confirmed?.count ?? 0,
    completed: completed?.count ?? 0,
    cancelled: cancelled?.count ?? 0,
    services,
  });
});

// Admin: export CSV
router.get("/bookings/export", requireAdmin, async (req, res): Promise<void> => {
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  const headers = ["ID", "Name", "Phone", "Email", "Location", "Service", "Preferred Date", "Status", "Notes", "Created At"];
  const rows = bookings.map(b => [
    b.id,
    `"${b.fullName.replace(/"/g, '""')}"`,
    b.phone,
    b.email,
    `"${b.location.replace(/"/g, '""')}"`,
    b.service,
    b.preferredDate,
    b.status,
    `"${(b.notes ?? "").replace(/"/g, '""')}"`,
    new Date(b.createdAt).toISOString(),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="bookings-${Date.now()}.csv"`);
  res.send(csv);
});

const updateBookingSchema = z.object({
  status: z.enum(["pending", "contacted", "confirmed", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

// Admin: update booking (status and/or notes)
router.patch("/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid booking id" }); return; }

  const parsed = updateBookingSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const updates: Partial<{ status: string; notes: string }> = {};
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [booking] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json(booking);
});

// Admin: delete booking
router.delete("/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid booking id" }); return; }

  const [deleted] = await db.delete(bookingsTable).where(eq(bookingsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Booking not found" }); return; }
  res.sendStatus(204);
});

export default router;
