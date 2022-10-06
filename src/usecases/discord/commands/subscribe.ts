import { ChannelType, Message, TextChannel } from 'discord.js'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Settings from '../../../config/settings'
import { SubscriptionDB } from '../../../infrastructure/db'
import { Command } from '../../../interfaces'

const { username, avatarURL } = Settings

@provide('Command', true)
@provide(SubscribeCommand, true)
export class SubscribeCommand implements Command {
  public name = 'subscribe'
  public description = 'Subscribe channel for game offers'

  constructor(
    @inject('Logger')
    private logger: Logger,
    private subscriptionDB: SubscriptionDB
  ) {}

  private async parseChannel(message: Message) {
    if (message.channel.type !== ChannelType.GuildText) return
    const channel = message.channel as TextChannel

    const webhooks = await channel.fetchWebhooks()
    const joinedChannel = webhooks.find((webhook) => webhook.name === username)

    if (joinedChannel) {
      message.reply('This channel is already subscribed.')
    }

    return channel
  }

  private async joinChannel(channel: TextChannel, type: string) {
    const { id, channelId, guildId } = await channel.createWebhook({
      name: channel.name,
      avatar: avatarURL
    })

    await this.subscriptionDB.insert({
      id,
      channel: channelId,
      guild: guildId,
      type
    })
  }

  public async execute(message: Message, [type, _]: string[]) {
    const { guild, member } = message
    const channel = await this.parseChannel(message)

    if (!channel) return

    await this.joinChannel(channel, type)

    this.logger.info(
      `${member?.displayName} subscribed to channel #${channel.name} on ${guild?.name}`
    )

    message.reply(
      "Channel subscribed successfully! I'm posting here whenever a new game is out on Game Pass."
    )
  }
}
