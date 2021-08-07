import filesize from 'filesize'
import { Client, Webhook, MessageEmbed } from 'discord.js'

import Settings from '@/config/settings'
import Game from '@/domain/Game'

const MAX_LENGTH = 300

const { username, avatarURL } = Settings

const client = new Client()
client.login(process.env.DISCORD_TOKEN)
export { client }

export function createEmbed (game: Game): MessageEmbed {
  const msg = new MessageEmbed()

  // Truncate large descriptions
  let description: string
  if (game.description.length > MAX_LENGTH) {
    description = `${game.description.slice(0, MAX_LENGTH)}...`
  } else {
    description = game.description
  }

  msg
    .setTitle(game.title)
    .setAuthor(game.developer)
    .setDescription(description)

  if (game.price) msg.addField('Price', `$${game.price / 100}`, true)
  if (game.size) msg.addField('Size', filesize(game.size), true)
  if (game.image) msg.setImage(game.image)

  return msg
}

export function broadcast (webhooks: Webhook[], msg: string, game: Game): void {
  const embed = createEmbed(game)

  webhooks.forEach(webhook => {
    webhook.send(msg, { username, avatarURL, embeds: [embed] })
  })
}

export async function getAllWebhooks (ids: string[]): Promise<Webhook[] | null> {
  return await Promise.all(ids.map(id => client.fetchWebhook(id)))
}
