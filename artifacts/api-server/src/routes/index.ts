import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import salesRouter from "./sales";
import authRouter from "./auth";
import statsRouter from "./stats";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/orders", ordersRouter);
router.use("/sales", salesRouter);
router.use("/auth", authRouter);
router.use("/stats", statsRouter);
router.use("/upload", uploadRouter);

export default router;
