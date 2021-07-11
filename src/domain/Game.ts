import { Game as IGame } from '../interfaces'

export class Game {
  id: string
  title: string
  developer: string
  image: string | null
  price: number | null
  size: number | null
  description: string
  last_sync: Date

  constructor(game: IGame) {
    this.id = game.id
    this.title = game.title
    this.developer = game.developer
    this.image = game.image
    this.price = game.price
    this.size = game.size
    this.description = game.description
    this.last_sync = game.last_sync || new Date()
  }
}