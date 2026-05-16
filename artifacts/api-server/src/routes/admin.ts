import { Router, type IRouter } from "express";
import { createAdminToken, validateAdminToken } from "../lib/adminAuth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const { password } = req.body as { password?: string };

  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) {
    req.log.error("ADMIN_PASSWORD environment variable not set");
    res.status(500).json({ error: "Admin not configured" });
    return;
  }

  if (password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = createAdminToken();
  req.log.info("Admin logged in");
  res.json({ token });
});

router.get("/admin/verify", async (req, res): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || !validateAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({ ok: true });
});

export default router;
