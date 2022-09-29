import 'reflect-metadata'
import { provide } from 'inversify-binding-decorators'
import { inject, named } from 'inversify'
import { AxiosInstance } from 'axios'
import { XboxGame } from 'interfaces'
import { curryRightN, isEmpty, map } from 'lodash/fp'
import { merge } from 'object-mapper'

import schema from './schemas'
import Game from '../../domain/Game'

const mergeFP = curryRightN(2, merge)

const params = {
  market: 'US',
  language: 'en-us',
  hydration: 'MobileDetailsForConsole'
}

@provide(EnrichGames)
export class EnrichGames {
  constructor(
    @inject('HttpClient') @named('xbox') private http: AxiosInstance
  ) {}

  public async execute(ids: string[]): Promise<Game[]> {
    if (isEmpty(ids)) return []

    const body = {
      Products: ids
    }

    const { data } = await this.http.post('/products', body, { params })
    const gameList: XboxGame[] = Object.values(data.Products)

    return map(mergeFP(schema))(gameList) as Game[]
  }
}
