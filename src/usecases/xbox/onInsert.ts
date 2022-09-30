import { provide } from 'inversify-binding-decorators'
import Game from '../../domain/Game'
import GameDB from '../../models/game'

@provide(OnInsertXbox)
export class OnInsertXbox {
  constructor(private gameDB: GameDB) {}

  public execute(fn: (game: Game) => void) {
    this.gameDB.subscribe(fn)
  }
}