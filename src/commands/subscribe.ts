import { readFileSync } from 'fs'
import { Message, TextChannel } from 'discord.js'
import Logger from '../config/logger.js'
import SubscriptionDB from '../models/subscription.js'
import Subscription from '../domain/Subscription.js'

const { username, avatarURL } = JSON.parse(readFileSync('../config/settings.json', 'utf8'))
const db = new SubscriptionDB()

export default {
  name: 'subscribe',
  description: 'Subscribe channel for Gamepass news',
  async execute (message: Message): Promise<void> {
    const webhooks = await (message.channel as TextChannel).fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name === username)
    if (webhook) {
      message.reply('This channel is already subscribed.')
      return
    }

    const {
      id,
      channelID: channel,
      guildID: guild
    } = await (message.channel as TextChannel).createWebhook(username, { avatar: avatarURL })

    const sub = new Subscription({ id, channel, guild })
    await db.insert(sub)

    const nickname = message.member?.displayName
    const channelName = (message.channel as TextChannel).name
    const guildName = message.guild?.name

    Logger.info(`${nickname} subscribed to channel #${channelName} on ${guildName}`)

    message.reply('Channel subscribed successfully! I\'m posting here whenever a new game is out on Game Pass.')
  }
}
