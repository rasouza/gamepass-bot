import 'reflect-metadata'
import { provide } from 'inversify-binding-decorators'

@provide(EnrichGames)
export class EnrichGames {
  constructor() {}
}
