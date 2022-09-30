import { Set } from 'immutable'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
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
  private xboxList!: Set<string>
  private dbList!: Set<string>

  constructor(
    private fetchList: FetchList,
    private enrichGames: EnrichGames,
    private insertGames: InsertGames,
    private listGamesFromDB: ListGamesFromDB,
    private deleteGames: DeleteGames,
    @inject('Logger') private logger: Logger
  ) {}

  private async load() {
    this.xboxList = Set(await this.fetchList.execute())
    this.dbList = Set(await this.listGamesFromDB.execute())
  }

  public async insert(dryRun = false) {
    await this.load()

    const diff = this.xboxList.subtract(this.dbList)
    if (diff.isEmpty()) return

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

    const diff = dbCatalog.subtract(xboxCatalog)
    if (diff.isEmpty()) return

    if (dryRun) {
      this.logger.info(
        `[XboxSync][dry-run mode] ${diff.count()} games should be deleted`
      )
      return
    }

    this.deleteGames.execute(diff.toArray())
  }
}
