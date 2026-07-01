"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update order status." };
  }
}
