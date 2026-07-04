const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log("Connecting to Prisma...");
    await prisma.$connect();
    console.log("Connected to Prisma!");

    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "public"."orders"("user_id");`);
      console.log("Created user_id index on orders");
    } catch (e) { console.log(e.message); }

    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "public"."order_items"("order_id");`);
      console.log("Created order_id index on order_items");
    } catch (e) { console.log(e.message); }

    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON "public"."order_items"("product_id");`);
      console.log("Created product_id index on order_items");
    } catch (e) { console.log(e.message); }

    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "public"."products"("category_id");`);
      console.log("Created category_id index on products");
    } catch (e) { console.log(e.message); }
    
    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "orders_coupon_id_idx" ON "public"."orders"("coupon_id");`);
      console.log("Created coupon_id index on orders");
    } catch (e) { console.log(e.message); }

    console.log("Done adding indexes");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
