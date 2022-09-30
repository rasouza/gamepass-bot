import 'reflect-metadata'
import { EmbedBuilder, Webhook, WebhookCreateMessageOptions } from 'discord.js'
import { provide } from 'inversify-binding-decorators'

import { FetchChannels } from './fetchChannels'

@provide(Broadcast)
export class Broadcast {
  private channels: Webhook[]

  constructor(private fetchChannels: FetchChannels) {
    this.channels = []
  }

  public async execute(type: string, message: string, embed: EmbedBuilder) {
    const content: WebhookCreateMessageOptions = {
      content: message
    }
    if (embed) content.embeds = [embed]

    this.channels = await this.fetchChannels.execute(type)
    this.channels.forEach((channel) => channel.send(content))
  }
}
