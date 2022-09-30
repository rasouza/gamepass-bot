import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import cron from 'node-cron'

import { container } from '../inversify.config'
import { XboxSync } from '../handlers/sync'

const CRON = process.env.CRON || '0 */1 * * * *'
const argv = yargs(hideBin(process.argv))
  .options({
    dryRun: { type: 'boolean' }
  })
  .parseSync()

const xboxSync = container.get<XboxSync>(XboxSync)

cron.schedule(CRON, () => xboxSync.insert(argv.dryRun))
