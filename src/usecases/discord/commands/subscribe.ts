import { Message, TextChannel } from 'discord.js'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Settings from '../../../config/settings'
import SubscriptionDB from '../../../infrastructure/db/repositories/subscription'

const { username, avatarURL } = Settings

@provide('Command', true)
@provide(SubscribeCommand, true)
export class SubscribeCommand {
  public name = 'subscribe'
  public description = 'Subscribe channel for game offers'

  constructor(
    @inject('Logger')
    private logger: Logger,
    private subscriptionDB: SubscriptionDB
  ) {}

  private async parseChannel(message: Message) {
    if (message.channel.type !== 'text') return
    const channel = message.channel as TextChannel

    const webhooks = await channel.fetchWebhooks()
    const joinedChannel = webhooks.find((webhook) => webhook.name === username)

    if (joinedChannel) {
      message.reply('This channel is already subscribed.')
    }

    return channel
  }

  private async joinChannel(channel: TextChannel) {
    const { id, channelID, guildID } = await channel.createWebhook(username, {
      avatar: avatarURL
    })

    await this.subscriptionDB.insert({ id, channel: channelID, guild: guildID })
  }

  public async execute(message: Message) {
    const { guild, member } = message
    const channel = await this.parseChannel(message)

    if (!channel) return

    await this.joinChannel(channel)

    this.logger.info(
      `${member?.displayName} subscribed to channel #${channel.name} on ${guild?.name}`
    )

    message.reply(
      "Channel subscribed successfully! I'm posting here whenever a new game is out on Game Pass."
    )
  }
}
