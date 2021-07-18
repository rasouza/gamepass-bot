
import { Set } from 'immutable'
import dotenv from 'dotenv'
dotenv.config()

import { getIdCatalog, searchGames } from './src/services/xbox'
import GameDB from './src/models/game'

import Logger from './src/config/logger'
import { startTransaction } from './src/config/sentry'

const gameDB = new GameDB()

async function sync () {
  Logger.info('Sync started! Checking new games...')
  const transaction = startTransaction('XBox Sync')

  const XboxCatalog = Set(await getIdCatalog())
  const games = Set((await gameDB.getAll()).map((game) => game.id))

  const insertDiff = XboxCatalog.subtract(games)
  const cleanupDiff = games.subtract(XboxCatalog)

  if (insertDiff.size > 0) {
    const newGames = await searchGames(insertDiff.toArray())
    gameDB.insert(newGames)
    Logger.info('New games inserted', { newGames })
  }

  if (cleanupDiff.size > 0) {
    cleanupDiff.forEach(async id => {
      const game = await gameDB.delete(id)
      Logger.info(`${game?.title} is being deleted`, { game })
    })
  }

  transaction.finish()
}

sync()
