import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, ilike, and, isNotNull } from "drizzle-orm";

const router: IRouter = Router();

function parseArr<T = unknown>(val: string | null | undefined): T[] {
  if (!val) return [];
  try { return JSON.parse(val) as T[]; } catch { return []; }
}

function stringifyArr(val: unknown): string | null {
  if (!Array.isArray(val) || val.length === 0) return null;
  return JSON.stringify(val);
}

function formatProduct(p: typeof productsTable.$inferSelect & { categoryName?: string | null }) {
  return {
    ...p,
    price: parseFloat(p.price as unknown as string),
    salePrice: p.salePrice ? parseFloat(p.salePrice as unknown as string) : null,
    colors: parseArr<string>(p.colors),
    storageOptions: parseArr<string>(p.storageOptions),
    variantStock: parseArr<{ color: string; storage: string; quantity: number }>(p.variantStock),
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  try {
    const { categoryId, search, onSale } = req.query;
    const conditions = [];
    if (categoryId) conditions.push(eq(productsTable.categoryId, Number(categoryId)));
    if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
    if (onSale === "true") conditions.push(isNotNull(productsTable.salePrice));

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        stock: productsTable.stock,
        imageUrl: productsTable.imageUrl,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        featured: productsTable.featured,
        colors: productsTable.colors,
        storageOptions: productsTable.storageOptions,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(products.map(formatProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, salePrice, stock, imageUrl, categoryId, featured, colors, storageOptions } = req.body;
    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        description,
        price: String(price),
        salePrice: salePrice != null ? String(salePrice) : null,
        stock: stock ?? 0,
        imageUrl: imageUrl ?? null,
        categoryId: categoryId ?? null,
        featured: featured ?? false,
        colors: stringifyArr(colors),
        storageOptions: stringifyArr(storageOptions),
      })
      .returning();

    const category = product.categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1)
      : [];

    res.status(201).json({ ...formatProduct(product), categoryName: category[0]?.name ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        stock: productsTable.stock,
        imageUrl: productsTable.imageUrl,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        featured: productsTable.featured,
        colors: productsTable.colors,
        storageOptions: productsTable.storageOptions,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!products.length) return res.status(404).json({ error: "Product not found" });
    res.json(formatProduct(products[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, salePrice, stock, imageUrl, categoryId, featured, colors, storageOptions } = req.body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = String(price);
    if (salePrice !== undefined) updateData.salePrice = salePrice != null ? String(salePrice) : null;
    if (stock !== undefined) updateData.stock = stock;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (featured !== undefined) updateData.featured = featured;
    if (colors !== undefined) updateData.colors = stringifyArr(colors);
    if (storageOptions !== undefined) updateData.storageOptions = stringifyArr(storageOptions);

    const [product] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) return res.status(404).json({ error: "Product not found" });

    const category = product.categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1)
      : [];

    res.json({ ...formatProduct(product), categoryName: category[0]?.name ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
