require('dotenv').config();

const xbox = require('./services/xbox')
const db = require('./services/supabase')
const Logger = require('./config/logger')
const config = require('./config/settings.json')

Logger.info('Sync started! Checking new games...');

const sync = async () => {
  const catalog = await xbox.getCatalog()
  Object.keys(catalog).forEach(async id => {
    const game = await db.getGameById(id)
  
    if (!game) {
      const data = db.parse(catalog[id])
      Logger.info(`Game ${data.title} not found. Inserting on database...`)
      db.insertGame(data)
    } else {
      db.syncGame(id)
    }
  })
}

// Cleanup
const cleanup = async () => {
  const today = new Date()
  today.setUTCHours(0,0,0,0)

  db.cleanupGamesBefore(today)
}

process.on('unhandledRejection', (error,) => {
  Logger.error(error);
});

sync()
// cleanup()