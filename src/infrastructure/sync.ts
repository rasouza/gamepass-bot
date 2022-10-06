import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { container } from '../inversify.config'
import { EpicSync, XboxSync } from '../handlers/sync'

const argv = yargs(hideBin(process.argv))
  .options({
    dryRun: { type: 'boolean' }
  })
  .parseSync()

const xboxSync = container.get<XboxSync>(XboxSync)
const epicSync = container.get<EpicSync>(EpicSync)

epicSync.insert(argv.dryRun)
xboxSync.insert(argv.dryRun)
