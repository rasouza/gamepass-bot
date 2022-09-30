import 'reflect-metadata'
import { MessageEmbed, Webhook } from 'discord.js'
import { provide } from 'inversify-binding-decorators'

import Settings from '../../config/settings'
import { FetchChannels } from './fetchChannels'

const { username, avatarURL } = Settings

interface MessageContent {
  username: string
  avatarURL: string
  embeds: MessageEmbed[]
}

@provide(Broadcast)
export class Broadcast {
  private channels: Webhook[]

  constructor(private fetchChannels: FetchChannels) {
    this.channels = []
  }

  public async execute(message: string, embed: MessageEmbed) {
    const content: MessageContent = {
      username,
      avatarURL,
      embeds: []
    }
    if (embed) content.embeds.push(embed)

    this.channels = await this.fetchChannels.execute()
    this.channels.forEach((channel) => channel.send(message, content))
  }
}
