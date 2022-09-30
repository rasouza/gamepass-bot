import { Set } from 'immutable'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { isEmpty } from 'lodash'
import { Logger } from 'winston'

import { SyncHandler } from '../../interfaces'
import {
  EnrichGames,
  FetchList,
  InsertGames,
  ListGamesFromDB,
  DeleteGames
} from '../../usecases'

@provide(XboxSync)
export class XboxSync implements SyncHandler {
  private xboxList: Promise<string[]>
  private dbList: Promise<string[]>

  constructor(
    private fetchList: FetchList,
    private enrichGames: EnrichGames,
    private insertGames: InsertGames,
    private listGamesFromDB: ListGamesFromDB,
    private deleteGames: DeleteGames,
    @inject('Logger') private logger: Logger
  ) {
    this.xboxList = this.fetchList.execute()
    this.dbList = this.listGamesFromDB.execute()
  }

  public async insert(dryRun = false) {
    const xboxCatalog = Set(await this.xboxList)
    const dbCatalog = Set(await this.dbList)

    const diff = xboxCatalog.subtract(dbCatalog)
    if (isEmpty(diff.toArray())) return

    const newCatalog = await this.enrichGames.execute(diff.toArray())

    if (dryRun) {
      this.logger.info(
        `[XboxSync][dry-run mode] ${newCatalog.length} games should be added`,
        { games: newCatalog }
      )
      return
    }

    await this.insertGames.execute(newCatalog)
  }

  public async clean(dryRun = false) {
    const xboxCatalog = Set(await this.xboxList)
    const dbCatalog = Set(await this.dbList)

    const diff = dbCatalog.subtract(xboxCatalog).toArray()
    if (isEmpty(diff)) return

    if (dryRun) {
      this.logger.info(
        `[XboxSync][dry-run mode] ${diff.length} games should be deleted`
      )
      return
    }

    this.deleteGames.execute(diff)
  }
}
