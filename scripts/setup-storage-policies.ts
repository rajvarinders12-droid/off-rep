import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function setupStoragePolicies() {
  console.log("Setting up Supabase Storage RLS Policies...");

  try {
    // 1. Give public access to read files from product-images bucket
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Access" 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'product-images');
    `).catch(e => console.log("Policy 'Public Access' might already exist."));

    // 2. Allow authenticated users to insert/upload files
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Authenticated users can upload images" 
      ON storage.objects FOR INSERT 
      TO authenticated 
      WITH CHECK (bucket_id = 'product-images');
    `).catch(e => console.log("Policy for INSERT might already exist."));

    // 3. Allow authenticated users to update their files
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Authenticated users can update images" 
      ON storage.objects FOR UPDATE 
      TO authenticated 
      USING (bucket_id = 'product-images');
    `).catch(e => console.log("Policy for UPDATE might already exist."));
    
    // 4. Allow authenticated users to delete files
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Authenticated users can delete images" 
      ON storage.objects FOR DELETE 
      TO authenticated 
      USING (bucket_id = 'product-images');
    `).catch(e => console.log("Policy for DELETE might already exist."));

    console.log("Storage RLS Policies setup completed successfully!");

  } catch (error) {
    console.error("Error setting up policies:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupStoragePolicies();
