import dotenv from 'dotenv'
dotenv.config()

import { getIdCatalog, searchGames } from './src/services/xbox'
import Logger from './src/config/logger'
import GameDB from './src/models/game'

const gameDB = new GameDB()

Logger.info('Sync started! Checking new games...');

async function getInsertDiff(ids: string[]): Promise<string[]> {
  return await ids.reduce(async (acc: Promise<string[]>, id: string) => {
    const exists = await gameDB.exists(id)
    if (!exists) return [...(await acc), id]

    return acc
  }, Promise.resolve([]))
}

async function getCleanupDiff(ids: string[]): Promise<string[]> {
  const games = await gameDB.getAll()
  
  return games
    ?.map(game => game.id)
    .filter(id => !ids.includes(id)) || []
}

async function sync() {
  const XboxCatalog = await getIdCatalog()
  const insertDiff = await getInsertDiff(XboxCatalog)
  const cleanupDiff = await getCleanupDiff(XboxCatalog)
  
  if (insertDiff.length > 0) {
    const newGames = await searchGames(insertDiff)
    gameDB.insert(newGames)
    Logger.info(`New games inserted`, { newGames })
  }

  if (cleanupDiff.length > 0) {
    cleanupDiff.forEach(async id => {
      const game = await gameDB.delete(id)
      Logger.info(`${game?.title} is being deleted`, { game })
    })
  }
}

sync()