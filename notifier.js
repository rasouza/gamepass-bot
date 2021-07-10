require('dotenv').config();

const { createClient } = require('@supabase/supabase-js')
const discord = require('./services/discord')
const xbox = require('./services/xbox')
const Logger = require('./config/logger')
const config = require('./config/settings.json')

const { id, token } = config.webhooks[0]

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

supabase.from('games').on('INSERT', async payload => {
  const game = discord.gameEmbed(payload.new)

  Logger.info(`New game inserted: ${game.title}`)
  discord.send(id, token, 'New game on Game Pass', game)
}).subscribe()

process.on('unhandledRejection', (error,) => {
  Logger.error(error);
});

Logger.info('Notifier started!')