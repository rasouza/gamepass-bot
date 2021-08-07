
import { Set } from 'immutable'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import Logger from '../src/config/logger.js'
import { startTransaction } from '../src/config/sentry.js'
import { getIdCatalog, searchGames } from '../src/services/xbox.js'
import GameDB from '../src/models/game.js'

const gameDB = new GameDB()

const argv = yargs(hideBin(process.argv)).options({
  dryRun: { type: 'boolean' }
}).parseSync()
if (argv.dryRun) Logger.info('running on dry run mode')

async function sync () {
  Logger.info('Sync started! Checking new games...')
  const transaction = startTransaction('XBox Sync')

  const XboxCatalog = Set(await getIdCatalog())
  const games = Set((await gameDB.getAll()).map((game) => game.id))

  const insertDiff = XboxCatalog.subtract(games)
  const cleanupDiff = games.subtract(XboxCatalog)

  if (insertDiff.size > 0) {
    const newGames = await searchGames(insertDiff.toArray())
    if (!argv.dryRun) gameDB.insert(newGames)
    Logger.debug('New games inserted', { newGames })
  }

  if (cleanupDiff.size > 0) {
    cleanupDiff.forEach(async id => {
      if (!argv.dryRun) {
        const game = await gameDB.delete(id)
        Logger.debug(`${game?.title} is being deleted`, { game })
      }
    })
  }

  transaction.finish()
}

sync()
