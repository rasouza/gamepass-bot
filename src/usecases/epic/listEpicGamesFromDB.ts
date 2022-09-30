import { provide } from 'inversify-binding-decorators'

import { EpicDB } from '../../infrastructure/db'

@provide(ListEpicGamesFromDB)
export class ListEpicGamesFromDB {
  constructor(private epicDB: EpicDB) {}

  public async execute() {
    return this.epicDB.pluck('id') as Promise<string[]>
  }
}
