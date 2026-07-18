import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    "014219f7-edcc-425a-ab77-f74bc4ba5ed2",
    { password: "AdminPassword123!" }
  );
  if (error) {
    console.error("Error updating password:", error.message);
  } else {
    console.log("Successfully updated password for admin@off-rep.com");
  }
}

resetPassword();
