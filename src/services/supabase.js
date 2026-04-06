import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://zbpdszjkifcmxiomsdbg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicGRzempraWZjbXhpb21zZGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjI5MTQsImV4cCI6MjA2ODM5ODkxNH0.zUqJsyzZzL7ibR1i8I-BrZ36Ey-NCSe-pCGODZSXlK8"
);