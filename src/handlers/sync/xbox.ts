import { Set } from 'immutable'
import { provide } from 'inversify-binding-decorators'
import { isEmpty } from 'lodash'

import {
  EnrichGames,
  FetchList,
  InsertGames,
  ListGamesFromDB,
  DeleteGames
} from 'usecases'

// TODO: Extract this interface
interface Sync {
  insert(): void
  clean(): void
}

@provide(XboxSync)
export class XboxSync implements Sync {
  private xboxList: Promise<string[]>
  private dbList: Promise<string[]>

  constructor(
    private fetchList: FetchList,
    private enrichGames: EnrichGames,
    private insertGames: InsertGames,
    private listGamesFromDB: ListGamesFromDB,
    private deleteGames: DeleteGames
  ) {
    this.xboxList = this.fetchList.execute()
    this.dbList = this.listGamesFromDB.execute()
  }

  public async insert() {
    const xboxCatalog = Set(await this.xboxList)
    const dbCatalog = Set(await this.dbList)

    const diff = xboxCatalog.subtract(dbCatalog)
    if (isEmpty(diff.toArray())) return

    const newCatalog = await this.enrichGames.execute(diff.toArray())

    await this.insertGames.execute(newCatalog)
  }

  public async clean() {
    const xboxCatalog = Set(await this.xboxList)
    const dbCatalog = Set(await this.dbList)

    const diff = dbCatalog.subtract(xboxCatalog)
    if (isEmpty(diff.toArray())) return

    this.deleteGames.execute(diff.toArray())
  }
}
