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

export async function createCategory(state: any, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name) {
    return { error: "Category name is required." };
  }

  const slug = `${generateSlug(name)}-${Date.now().toString().slice(-4)}`;

  try {
    await db.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
      },
    });
  } catch (error: any) {
    return { error: error.message || "Failed to create category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete category." };
  }
}
