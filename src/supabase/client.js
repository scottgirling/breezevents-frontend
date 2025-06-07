import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://xvmroxtbmxqhinhufsyx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bXJveHRibXhxaGluaHVmc3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTUxMjgsImV4cCI6MjA2MzkzMTEyOH0.WdRWzOvgEOFQpULmlY_6qRVkWnfQ1wbSl957A0oOF1E';

export const supabase = createClient(supabaseUrl, serviceRoleKey);