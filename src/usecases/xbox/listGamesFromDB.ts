import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import GameDB from 'models/game'

@provide(ListGamesFromDB)
export class ListGamesFromDB {
  constructor(
    private gameDB: GameDB,
    @inject('Logger') private logger: Logger
  ) {}

  public async execute() {
    return this.gameDB.pluck('id') as Promise<string[]>
  }
}
