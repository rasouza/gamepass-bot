require('dotenv').config();

const { createClient } = require('@supabase/supabase-js')
const discord = require('./services/discord')
const xbox = require('./services/xbox')
const db = require('./services/supabase')
const Logger = require('./config/logger')
const config = require('./config/settings.json')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
Logger.info('Sync started! Checking new games...');

const sync = async () => {
  const catalog = await xbox.getCatalog()
  Object.keys(catalog).forEach(async id => {
    const game = db.parse(catalog[id])
    let { data, error } = await supabase.from('games').select('*').eq('id', id)
    if (error) Logger.error(error)

    if (data.length === 0) {
      Logger.info(`Game ${game.title} not found. Inserting on database...`)
      let { data, error } = await supabase.from('games').insert(game)
      if (error) Logger.error(error)
    } else {
      const date = new Date()
      let { data, error } = await supabase.from('games').update({ last_sync: date }).eq('id', game.id)
      Logger.debug(`${game.title} updated at ${date}`)
      if (error) Logger.error(error)
    }

  
  })
}

// Cleanup
const cleanup = async () => {
  const today = new Date()
  today.setUTCHours(0,0,0,0)

  let { data, error } = await supabase.from('games').delete().lt('last_sync', today.toISOString())
  data.forEach(game => Logger.info(`Cleaning up ${game.title}`))

  if (error) Logger.error(error)
}

process.on('unhandledRejection', (error,) => {
  Logger.error(error);
});

sync()
cleanup()