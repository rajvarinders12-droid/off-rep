import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log("Seeding categories...");
  const categories = [
    { name: "Electronics", slug: "electronics", description: "Gadgets and devices" },
    { name: "Clothing", slug: "clothing", description: "Apparel and fashion accessories" },
    { name: "Home & Kitchen", slug: "home-kitchen", description: "Home decor, appliances, and kitchenware" },
    { name: "Books", slug: "books", description: "Novels, textbooks, and guides" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded successfully.");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("Supabase URL or Service key missing, skipping storage bucket setup.");
    return;
  }

  console.log("Setting up Supabase storage bucket...");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if bucket exists
  const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
  if (getBucketsError) {
    console.error("Error listing buckets:", getBucketsError.message);
    return;
  }

  const bucketExists = buckets?.some((b) => b.name === "product-images");

  if (!bucketExists) {
    const { error: createBucketError } = await supabase.storage.createBucket("product-images", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      fileSizeLimit: 5242880, // 5MB
    });

    if (createBucketError) {
      console.error("Error creating bucket:", createBucketError.message);
    } else {
      console.log("Storage bucket 'product-images' created successfully.");
    }
  } else {
    console.log("Storage bucket 'product-images' already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
