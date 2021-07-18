import Logger from '../config/logger.js'

import Game from '../domain/Game.js'
import { GameModel } from '../interfaces/index.js'
import { DB } from './base.js'

export default class GameDB extends DB<GameModel, Game> {
  name = 'games'

  async cleanupGamesBefore (date: Date): Promise<GameModel[] | null> {
    const { data, error } = await this.getTable().delete().lt('last_sync', date)

    if (data) data.forEach(game => Logger.info(`Cleaning up ${game.title}`))
    if (error) Logger.error(error)

    return data
  }

  onInsert (fnInsert: (game: Game) => void): void {
    this.getTable().on('INSERT', payload => {
      Logger.debug('New game inserted', { game: payload.new })
      const game = new Game(payload.new)

      fnInsert(game)
    }).subscribe()
  }
}
