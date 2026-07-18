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

import { redirect } from "next/navigation";

export async function deleteOrder(orderId: string) {
  try {
    await db.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
  } catch (error: any) {
    console.error("Failed to delete order:", error);
  }
  redirect("/admin/orders");
}
