import 'reflect-metadata'
import fileSize from 'filesize'
import { provide } from 'inversify-binding-decorators'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'

import Game from 'domain/Game'

// TODO: Extract to config
const MAX_LENGTH = 300

@provide(GameEmbed)
export class GameEmbed extends MessageEmbed {
  constructor(game: Game, options?: MessageEmbed | MessageEmbedOptions) {
    const { title, developer, description, price, size, image } = game
    super(options)

    this.setTitle(title)
    this.setAuthor(developer)
    this.setDescription(this.truncate(description))

    if (price) this.addField('Price', `$${price / 100}`, true)
    if (size) this.addField('Size', fileSize(size), true)
    if (image) this.setImage(image)
  }

  private truncate(text: string) {
    if (text.length > MAX_LENGTH) {
      return `${text.slice(0, MAX_LENGTH)}...`
    }
    return text
  }
}
