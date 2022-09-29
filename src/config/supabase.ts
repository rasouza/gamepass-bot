import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_KEY } = process.env

export const createSupabase = () =>
  createClient(SUPABASE_URL as string, SUPABASE_KEY as string)
