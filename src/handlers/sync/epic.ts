import { List } from 'immutable'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'
import Game from '../../domain/Game'

import { SyncHandler } from '../../interfaces'
import {
  FetchEpicGames,
  BatchInsertEpicGames,
  ListEpicGamesFromDB
} from '../../usecases'

@provide(EpicSync)
export class EpicSync implements SyncHandler {
  private platformList!: List<Game>
  private dbList!: List<string>

  constructor(
    private fetchEpicGames: FetchEpicGames,
    private listFromDB: ListEpicGamesFromDB,
    private insertEpicGames: BatchInsertEpicGames,
    @inject('Logger') private logger: Logger
  ) {}

  private async load() {
    this.platformList = List(await this.fetchEpicGames.execute())
    this.dbList = List(await this.listFromDB.execute())
  }

  async insert(dryRun = false) {
    await this.load()

    const diff = this.platformList.takeWhile(
      (game) => !this.dbList.contains(game.id)
    )

    if (dryRun) {
      this.logger.info(
        `[EpicSync][dry-run mode] ${diff.count()} games should be added`,
        { games: diff.toArray() }
      )
      return
    }

    if (!diff.isEmpty()) this.insertEpicGames.execute(diff.toArray())
  }

  clean(): void {
    throw new Error('Method not implemented.')
  }
}
