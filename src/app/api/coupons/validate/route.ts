import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/context/cart-context";

export async function POST(request: NextRequest) {
  try {
    const { code, cart } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    // Determine eligible items based on coupon flags
    let eligibleSubtotal = 0;
    let hasEligibleItems = false;

    for (const item of cart as CartItem[]) {
      const isItemWholesale = !!item.isWholesale;
      
      const isEligible = 
        (isItemWholesale && coupon.isForWholesale) || 
        (!isItemWholesale && coupon.isForRetail);

      if (isEligible) {
        hasEligibleItems = true;
        eligibleSubtotal += item.price * item.quantity;
      }
    }

    if (!hasEligibleItems) {
      const message = coupon.isForWholesale
        ? "This coupon is only valid for wholesale items."
        : "This coupon is only valid for retail items.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "fixed") {
      discountAmount = Number(coupon.discountValue);
      // Cap discount at eligible subtotal
      if (discountAmount > eligibleSubtotal) {
        discountAmount = eligibleSubtotal;
      }
    } else if (coupon.discountType === "percentage") {
      discountAmount = (eligibleSubtotal * Number(coupon.discountValue)) / 100;
    }

    return NextResponse.json({
      success: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: discountAmount,
      message: "Coupon applied successfully!",
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
