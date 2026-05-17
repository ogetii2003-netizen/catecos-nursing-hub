import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import dbtestRouter from "./dbtest";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(dbtestRouter);

export default router;
