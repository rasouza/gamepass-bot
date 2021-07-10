const { createClient } = require('@supabase/supabase-js')

const discord = require('./services/discord')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

supabase.from('games').on('INSERT')