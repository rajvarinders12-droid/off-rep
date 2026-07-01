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

async function resetUsers() {
  console.log("Starting user reset...");

  try {
    // 1. Get all users from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError.message);
      return;
    }

    console.log(`Found ${users.length} users in Supabase Auth.`);

    // 2. Delete all users from Supabase Auth
    for (const user of users) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) {
        console.error(`Error deleting user ${user.id}:`, deleteError.message);
      } else {
        console.log(`Deleted user from Auth: ${user.email}`);
      }
    }

    // 3. Clear the profiles table in our database (just in case they weren't deleted by cascade)
    const deleteResult = await prisma.profile.deleteMany();
    console.log(`Deleted ${deleteResult.count} profiles from the database.`);

    console.log("\nAll users have been successfully deleted.");

  } catch (error) {
    console.error("An unexpected error occurred:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUsers();
