"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createProduct(state: any, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const priceString = formData.get("price") as string;
  const stockString = formData.get("stock") as string;
  const categoryId = formData.get("categoryId") as string;
  const imagesJson = formData.get("images") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const wholesalePriceString = formData.get("wholesalePrice") as string;
  const moqString = formData.get("moq") as string;
  const sizeChart = formData.get("sizeChart") as string;
  const searchKeywords = formData.get("searchKeywords") as string;
  const colorsJson = formData.get("colors") as string;
  const sizesJson = formData.get("sizes") as string;
  const compareAtPriceString = formData.get("compareAtPrice") as string | null;

  if (!name || !priceString || !stockString) {
    return { error: "Name, price, and stock are required." };
  }

  const price = parseFloat(priceString);
  const stock = parseInt(stockString);
  const compareAtPrice = compareAtPriceString ? parseFloat(compareAtPriceString) : null;

  if (isNaN(price) || price <= 0) {
    return { error: "Price must be a valid positive number." };
  }

  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a valid non-negative number." };
  }

  let wholesalePrice: number | null = null;
  let moq: number | null = null;

  if (wholesalePriceString) {
    wholesalePrice = parseFloat(wholesalePriceString);
    if (isNaN(wholesalePrice) || wholesalePrice <= 0) {
      return { error: "Wholesale price must be a valid positive number." };
    }
    moq = moqString ? parseInt(moqString) : 1;
    if (isNaN(moq) || moq < 1) {
      return { error: "Minimum Order Quantity (MOQ) must be at least 1." };
    }
  }

  let images: string[] = [];
  try { images = JSON.parse(imagesJson || "[]"); } catch (e) { images = []; }

  let colors: any[] = [];
  try { colors = JSON.parse(colorsJson || "[]"); } catch (e) { colors = []; }

  let sizes: string[] = [];
  try { sizes = JSON.parse(sizesJson || "[]"); } catch (e) { sizes = []; }

  const slug = `${generateSlug(name)}-${Date.now().toString().slice(-4)}`;

  try {
    await db.product.create({
      data: {
        name,
        slug,
        description,
        features: features || null,
        price,
        compareAtPrice,
        wholesalePrice,
        moq,
        stock,
        categoryId: categoryId || null,
        images,
        isFeatured,
        sizeChart: sizeChart || null,
        searchKeywords: searchKeywords || null,
        colors: colors,
        sizes: sizes,
      },
    });
  } catch (error: any) {
    return { error: error.message || "Failed to create product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    // Delete associated OrderItems first to prevent foreign key constraint failures (Prisma P2003)
    await db.$transaction([
      db.orderItem.deleteMany({ where: { productId: id } }),
      db.product.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { error: "Failed to delete product." };
  }
}

export async function updateProduct(id: string, state: any, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const priceString = formData.get("price") as string;
  const stockString = formData.get("stock") as string;
  const categoryId = formData.get("categoryId") as string;
  const imagesJson = formData.get("images") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const wholesalePriceString = formData.get("wholesalePrice") as string;
  const moqString = formData.get("moq") as string;
  const sizeChart = formData.get("sizeChart") as string;
  const searchKeywords = formData.get("searchKeywords") as string;
  const colorsJson = formData.get("colors") as string;
  const sizesJson = formData.get("sizes") as string;
  const compareAtPriceString = formData.get("compareAtPrice") as string | null;

  if (!name || !priceString || !stockString) {
    return { error: "Name, price, and stock are required." };
  }

  const price = parseFloat(priceString);
  const stock = parseInt(stockString);
  const compareAtPrice = compareAtPriceString ? parseFloat(compareAtPriceString) : null;

  if (isNaN(price) || price <= 0) {
    return { error: "Price must be a valid positive number." };
  }

  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a valid non-negative number." };
  }

  let wholesalePrice: number | null = null;
  let moq: number | null = null;

  if (wholesalePriceString) {
    wholesalePrice = parseFloat(wholesalePriceString);
    if (isNaN(wholesalePrice) || wholesalePrice <= 0) {
      return { error: "Wholesale price must be a valid positive number." };
    }
    moq = moqString ? parseInt(moqString) : 1;
    if (isNaN(moq) || moq < 1) {
      return { error: "Minimum Order Quantity (MOQ) must be at least 1." };
    }
  }

  let images: string[] = [];
  try { images = JSON.parse(imagesJson || "[]"); } catch (e) { images = []; }

  let colors: any[] = [];
  try { colors = JSON.parse(colorsJson || "[]"); } catch (e) { colors = []; }

  let sizes: string[] = [];
  try { sizes = JSON.parse(sizesJson || "[]"); } catch (e) { sizes = []; }

  try {
    await db.product.update({
      where: { id },
      data: {
        name,
        description,
        features: features || null,
        price,
        compareAtPrice,
        wholesalePrice,
        moq,
        stock,
        categoryId: categoryId || null,
        images,
        isFeatured,
        sizeChart: sizeChart || null,
        searchKeywords: searchKeywords || null,
        colors: colors,
        sizes: sizes,
      },
    });
  } catch (error: any) {
    return { error: error.message || "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}
