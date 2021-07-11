import dotenv from 'dotenv'
dotenv.config()

import { getGameById, insertGame, syncGame, cleanupGamesBefore, parse } from './services/supabase'
import { getCatalog } from './services/xbox'
import Logger from './config/logger'

Logger.info('Sync started! Checking new games...');

const sync = async () => {
  const catalog = await getCatalog()
  Object.keys(catalog).forEach(async id => {
    const game = await getGameById(id)
  
    if (!game) {
      const data = parse(catalog[id])
      Logger.info(`Game ${data.title} not found. Inserting on database...`)
      insertGame(data)
    } else {
      syncGame(id)
    }
  })
}

// Cleanup
const cleanup = async () => {
  const today = new Date()
  today.setUTCHours(0,0,0,0)

  cleanupGamesBefore(today)
}

process.on('unhandledRejection', (error,) => {
  Logger.error(error);
});

sync()
// cleanup()