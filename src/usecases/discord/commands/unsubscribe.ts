import { ChannelType, Message, TextChannel } from 'discord.js'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Settings from '../../../config/settings'
import { SubscriptionDB } from '../../../infrastructure/db'
import { Command } from '../../../interfaces'

const { username } = Settings

@provide('Command', true)
@provide(UnsubscribeCommand, true)
export class UnsubscribeCommand implements Command {
  public name = 'unsubscribe'
  public description = 'Unsubscribe channel for game offers'

  constructor(
    @inject('Logger')
    private logger: Logger,
    private subscriptionDB: SubscriptionDB
  ) {}

  public async execute(message: Message) {
    if (message.channel.type !== ChannelType.GuildText) return

    const { guild, member } = message
    const channel = message.channel as TextChannel

    const webhooks = await channel.fetchWebhooks()
    const joinedChannel = webhooks.find((webhook) => webhook.name === username)

    if (!joinedChannel) return

    this.subscriptionDB.delete(joinedChannel.id)
    joinedChannel.delete()

    this.logger.info(
      `${member?.displayName} subscribed to channel #${channel.name} on ${guild?.name}`
    )

    message.reply('This channel is unsubscribed from Game Pass news')
  }
}
