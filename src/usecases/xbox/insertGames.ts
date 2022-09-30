import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { isEmpty } from 'lodash/fp'
import { Logger } from 'winston'

import Game from '../../domain/Game'
import GameDB from '../../infrastructure/db/repositories/game'

@provide(InsertGames)
export class InsertGames {
  constructor(
    private gameDB: GameDB,
    @inject('Logger') private logger: Logger
  ) {}

  public async execute(games: Game | Game[]) {
    if (isEmpty(games))
      throw new Error('[InsertGames UseCase] Trying to insert empty')

    await this.gameDB.insert(games)
    this.logger.debug('Games added', {
      games
    })
  }
}
