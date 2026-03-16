import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { salesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  try {
    const sales = await db.select().from(salesTable).orderBy(salesTable.createdAt);
    res.json(sales.map((s) => ({
      ...s,
      discountPercent: parseFloat(s.discountPercent),
      startDate: s.startDate.toISOString(),
      endDate: s.endDate.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, discountPercent, productId, categoryId, startDate, endDate } = req.body;
    const [sale] = await db
      .insert(salesTable)
      .values({
        title,
        description: description ?? null,
        discountPercent: String(discountPercent),
        productId: productId ?? null,
        categoryId: categoryId ?? null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active: true,
      })
      .returning();

    res.status(201).json({
      ...sale,
      discountPercent: parseFloat(sale.discountPercent),
      startDate: sale.startDate.toISOString(),
      endDate: sale.endDate.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(salesTable).where(eq(salesTable.id, id));
    res.json({ message: "Sale deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete sale" });
  }
});

export default router;
