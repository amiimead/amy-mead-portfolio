import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://teiankabnmjzstdfdqw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaWFua2FibmptanpzdGRmZHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTI2OTIsImV4cCI6MjA5ODQ2ODY5Mn0.C57jMoxhGtGK3gP3KRIOO8kegi22MmmZtV9uF5vLRpY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
