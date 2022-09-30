import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { isEmpty } from 'lodash/fp'
import { Logger } from 'winston'

import { GameDB } from '../../infrastructure/db'

@provide(DeleteGames)
export class DeleteGames {
  constructor(
    private gameDB: GameDB,
    @inject('Logger') private logger: Logger
  ) {}

  public async execute(gameIds: string[]) {
    if (isEmpty(gameIds))
      throw new Error('[DeleteGames UseCase] Trying to delete empty')

    const deleteGame = (id: string) => this.gameDB.delete(id)
    const deletedGames = await Promise.all(gameIds.map(deleteGame))
    this.logger.debug(
      `[DeleteGames UseCase] ${deletedGames.length} games deleted`,
      {
        games: deletedGames
      }
    )
  }
}
