import 'reflect-metadata'
import { provide } from 'inversify-binding-decorators'
import { inject, named } from 'inversify'
import { AxiosInstance } from 'axios'
import { Logger } from 'winston'
import { pipe, map, tail } from 'lodash/fp'

const params = {
  id: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff', // All PC Games
  language: 'en-us',
  market: 'US'
}

@provide(FetchList)
export class FetchList {
  constructor(
    @inject('HttpClient') @named('xbox') private http: AxiosInstance,
    @inject('Logger') private logger: Logger
  ) {}

  public async execute(): Promise<string[]> {
    const { data } = await this.http.get('/sigls/v2', { params })
    this.logger.debug(
      `[FetchList UseCase] Found ${data.length - 1} games in XBox Game Pass`
    )

    return pipe(tail, map('id'))(data)
  }
}
