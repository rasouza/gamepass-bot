import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { isEmpty, map, omit } from 'lodash/fp'
import { Logger } from 'winston'

import Game from '../../domain/Game'
import { EpicDB } from '../../infrastructure/db'

@provide(BatchInsertEpicGames)
export class BatchInsertEpicGames {
  constructor(private db: EpicDB, @inject('Logger') private logger: Logger) {}

  public async execute(games: Game[]) {
    if (isEmpty(games))
      throw new Error('[InsertEpicGames UseCase] Trying to insert empty')

    const records = map(omit(['offer']))(games) as Game[]
    await this.db.insert(records)
    this.logger.debug(
      `[InsertEpicGames UseCase] ${records.length} games added`,
      {
        games
      }
    )
  }
}
