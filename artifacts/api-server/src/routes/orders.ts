import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function getOrderWithItems(orderId: number) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
  if (!orders.length) return null;
  const order = orders[0];
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));

  return {
    ...order,
    totalAmount: parseFloat(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      ...item,
      unitPrice: parseFloat(item.unitPrice),
      totalPrice: parseFloat(item.totalPrice),
    })),
  };
}

router.get("/", async (_req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    const withItems = await Promise.all(orders.map((o) => getOrderWithItems(o.id)));
    res.json(withItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items } = req.body;

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const products = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
      if (!products.length) return res.status(400).json({ error: `Product ${item.productId} not found` });
      const product = products[0];
      const unitPrice = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;
      resolvedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: String(unitPrice),
        totalPrice: String(totalPrice),
      });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? null,
        totalAmount: String(totalAmount),
        status: "pending",
      })
      .returning();

    await db.insert(orderItemsTable).values(
      resolvedItems.map((item) => ({ ...item, orderId: order.id }))
    );

    const fullOrder = await getOrderWithItems(order.id);
    res.status(201).json(fullOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const order = await getOrderWithItems(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const [order] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) return res.status(404).json({ error: "Order not found" });
    const fullOrder = await getOrderWithItems(order.id);
    res.json(fullOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
