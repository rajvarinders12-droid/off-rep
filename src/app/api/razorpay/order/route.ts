import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { cartItems, shippingAddress } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // 3. Verify product prices and stock from DB (prevent price tampering)
    const productIds = cartItems.map((item: { id: string }) => item.id);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalPrice = 0;
    const verifiedItems: { productId: string; quantity: number; price: number }[] = [];

    for (const cartItem of cartItems) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${cartItem.name}" not found` },
          { status: 400 }
        );
      }
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `"${product.name}" only has ${product.stock} units in stock` },
          { status: 400 }
        );
      }
      let price = Number(product.price);
      
      if (cartItem.isWholesale) {
        if (!product.wholesalePrice) {
          return NextResponse.json(
            { error: `Product "${product.name}" does not support wholesale pricing` },
            { status: 400 }
          );
        }
        if (product.moq && cartItem.quantity < product.moq) {
          return NextResponse.json(
            { error: `Product "${product.name}" requires a minimum quantity of ${product.moq} for wholesale pricing.` },
            { status: 400 }
          );
        }
        price = Number(product.wholesalePrice);
      }

      totalPrice += price * cartItem.quantity;
      verifiedItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price,
      });
    }

    // Add shipping (free above ₹999)
    const shipping = totalPrice >= 999 ? 0 : 99;
    totalPrice += shipping;

    // 4. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // 5. Create order in our database (status: pending)
    const order = await db.order.create({
      data: {
        userId: user.id,
        status: "pending",
        totalPrice,
        shippingAddress,
        razorpayOrderId: razorpayOrder.id,
        orderItems: {
          create: verifiedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 6. Return Razorpay order details to the frontend
    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
