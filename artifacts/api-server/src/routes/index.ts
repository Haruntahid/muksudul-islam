import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resourcesRouter from "./resources";
import authRouter from "./auth";
import inboxRouter from "./inbox";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/v1", resourcesRouter);
router.use("/v1/auth", authRouter);
router.use("/v1", inboxRouter);

export default router;

