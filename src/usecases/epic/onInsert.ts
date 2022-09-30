import { provide } from 'inversify-binding-decorators'

import Game from '../../domain/Game'
import { EpicDB } from '../../infrastructure/db'

@provide(OnInsertEpic)
export class OnInsertEpic {
  constructor(private db: EpicDB) {}

  public execute(fn: (game: Game) => void) {
    this.db.subscribe(fn)
  }
}
