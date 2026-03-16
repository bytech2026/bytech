import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, salesTable } from "@workspace/db/schema";
import { sql, eq, lte } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  try {
    const [{ totalProducts }] = await db
      .select({ totalProducts: sql<number>`count(*)::int` })
      .from(productsTable);

    const [{ totalOrders }] = await db
      .select({ totalOrders: sql<number>`count(*)::int` })
      .from(ordersTable);

    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`coalesce(sum(total_amount), 0)::float` })
      .from(ordersTable);

    const [{ pendingOrders }] = await db
      .select({ pendingOrders: sql<number>`count(*)::int` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "pending"));

    const [{ lowStockProducts }] = await db
      .select({ lowStockProducts: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(lte(productsTable.stock, 5));

    const [{ activeSales }] = await db
      .select({ activeSales: sql<number>`count(*)::int` })
      .from(salesTable)
      .where(eq(salesTable.active, true));

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      activeSales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
