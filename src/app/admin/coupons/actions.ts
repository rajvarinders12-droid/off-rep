"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DiscountType } from "@prisma/client";

export async function createCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  const discountType = formData.get("discountType") as DiscountType;
  const discountValue = parseFloat(formData.get("discountValue") as string);
  const isForRetail = formData.get("isForRetail") === "on";
  const isForWholesale = formData.get("isForWholesale") === "on";

  if (!code || !discountType || isNaN(discountValue)) {
    return { error: "Please provide all required fields." };
  }

  if (!isForRetail && !isForWholesale) {
    return { error: "Coupon must be valid for at least one order type (Retail or Wholesale)." };
  }

  try {
    await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        isForRetail,
        isForWholesale,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A coupon with this code already exists." };
    }
    return { error: "Failed to create coupon." };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    await db.coupon.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update coupon status." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await db.coupon.delete({
      where: { id },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete coupon." };
  }
}
