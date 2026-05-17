import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/dbtest", async (req, res): Promise<void> => {
  const url = process.env["DATABASE_URL"] ?? "";
  try {
    const r = await pool.query("SELECT 1 AS ok, version() AS pg_version");
    res.json({
      status: "ok",
      url_prefix: url.slice(0, 60),
      result: r.rows[0],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const cause = (err as { cause?: { message?: string } })?.cause?.message ?? null;
    res.status(500).json({
      status: "fail",
      url_prefix: url.slice(0, 60),
      error: msg,
      cause,
    });
  }
});

export default router;
