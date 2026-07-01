import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@off-rep.com";
  const password = "OffRepAdmin2026!";

  console.log(`Creating admin user: ${email}`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error("Error creating auth user:", authError.message);
    process.exit(1);
  }

  const user = authData.user;
  console.log("Auth user created with ID:", user.id);

  // 2. Ensure the profile exists and is an admin
  try {
    // Supabase triggers might automatically create a profile, let's upsert to be safe
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        role: "admin",
        fullName: "System Admin",
      },
      create: {
        id: user.id,
        email: email,
        role: "admin",
        fullName: "System Admin",
      },
    });
    console.log("Admin profile successfully created/updated in the database.");
    console.log("\n--- ADMIN CREDENTIALS ---");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-------------------------\n");
  } catch (dbError) {
    console.error("Error updating profile in database:", dbError);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
