import { provide } from 'inversify-binding-decorators'

import { DB } from './base'
import Game from '../../../domain/Game'

@provide(GameDB)
export class GameDB extends DB<Game> {
  name = 'games'
}
