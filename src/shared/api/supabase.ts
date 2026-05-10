import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fftdhndvdqipwppbktfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdGRobmR2ZHFpcHdwcGJrdGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTExNDQsImV4cCI6MjA4NjYyNzE0NH0.cc95JDZEBpDEEhOJ3tt1HNYxVkks8X8V6wNNkXm5Tnw';

export const supabase = createClient(supabaseUrl, supabaseKey);
