import { provide } from 'inversify-binding-decorators'

import { DB } from './base'
import Game from '../../../domain/Game'

@provide(EpicDB)
export class EpicDB extends DB<Game> {
  name = 'epic'
}
