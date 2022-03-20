import { Set } from 'immutable'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import cron from 'node-cron'

import Logger from 'config/logger'
import { startTransaction } from 'config/sentry'
import { getIdCatalog, searchGames } from 'services/xbox'
import GameDB from 'models/game'

const CRON = process.env.CRON || '0 */1 * * * *'
const gameDB = new GameDB()

const argv = yargs(hideBin(process.argv))
  .options({
    dryRun: { type: 'boolean' }
  })
  .parseSync()
if (argv.dryRun) Logger.info('running on dry run mode')

async function sync() {
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
    cleanupDiff.forEach(async (id) => {
      if (!argv.dryRun) {
        const game = await gameDB.delete(id)
        Logger.debug(`${game?.title} is being deleted`, { game })
      }
    })
  }

  transaction.finish()
}

cron.schedule(CRON, sync)
