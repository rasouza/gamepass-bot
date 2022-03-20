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

async function add(gameIds: string[]): Promise<number> {
  if (gameIds.length === 0) return 0

  const newGames = await searchGames(gameIds)
  gameDB.insert(newGames)

  return gameIds.length
}

async function clean(gameIds: string[]): Promise<number> {
  if (gameIds.length === 0) return 0

  const games = gameIds.map(async (id) => await gameDB.delete(id))
  Logger.debug({ message: 'Some games were deleted from the catalog', games })

  return gameIds.length
}

async function sync() {
  Logger.info('Sync started!')
  const transaction = startTransaction('XBox Sync')

  const XboxCatalog = Set(await getIdCatalog())
  const games = Set((await gameDB.getAll()).map((game) => game.id))

  const insertDiff = XboxCatalog.subtract(games)
  const cleanupDiff = games.subtract(XboxCatalog)

  if (!argv.dryRun) {
    add(insertDiff.toArray()).then((num) =>
      Logger.debug(`${num} games were added`)
    )

    clean(cleanupDiff.toArray()).then((num) =>
      Logger.debug(`${num} games were removed`)
    )
  }

  transaction.finish()
  Logger.info('Sync finished!')
}

cron.schedule(CRON, sync)
