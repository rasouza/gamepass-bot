import 'reflect-metadata'
import fileSize from 'filesize'
import { provide } from 'inversify-binding-decorators'
import { EmbedBuilder } from 'discord.js'

import Game from '../domain/Game'

const MAX_LENGTH = 300

@provide(GameEmbed)
export class GameEmbed {
  show(game: Game) {
    const builder = new EmbedBuilder()
    const fields = []
    const { title, developer, description, price, size, image } = game

    builder.setTitle(title)
    builder.setDescription(this.truncate(description))
    if (image) builder.setImage(image)

    if (price) fields.push({ name: 'Price', value: `$${price / 100}` })
    if (size) fields.push({ name: 'Size', value: fileSize(size) })
    if (developer) fields.push({ name: 'Developer', value: developer })
    builder.addFields(fields)

    return builder
  }

  private truncate(text: string) {
    if (text.length > MAX_LENGTH) {
      return `${text.slice(0, MAX_LENGTH)}...`
    }
    return text
  }
}
