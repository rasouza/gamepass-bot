import { AxiosInstance } from 'axios'
import { inject, named } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { curryRightN, filter, isEmpty, map, pipe } from 'lodash/fp'
import { merge } from 'object-mapper'
import Game from '../../domain/Game'

import schema from './schemas'

const mergeFP = curryRightN(2, merge)

@provide(FetchEpicGames)
export class FetchEpicGames {
  constructor(
    @inject('HttpClient') @named('epic') private http: AxiosInstance
  ) {}

  public async execute(): Promise<Game[]> {
    const hasOffer = (game: any) => !isEmpty(game.offer)
    const parseGames = pipe(map(mergeFP(schema)), filter(hasOffer))

    const response = await this.http.get('/freeGamesPromotions')
    return parseGames(response.data.data.Catalog.searchStore.elements)
  }
}
