import filesize from 'filesize'
import { Client, Webhook, MessageEmbed } from 'discord.js'

import { username, avatarURL } from '../config/settings.json'
import { Embed } from '../interfaces'
import Game from '../domain/Game'

const MAX_LENGTH = 300

const client = new Client();
client.login(process.env.DISCORD_TOKEN)
export { client }

export function createEmbed(game: Game): MessageEmbed {
  
  const config: Embed = {
    title: game.title,
    author: { name: game.developer },
    image: { url: game.image }
  }

  // Truncate large descriptions
  if (game.description.length > MAX_LENGTH) {
    config.description = `${game.description.slice(0, MAX_LENGTH)}...`
  } else {
    config.description = game.description
  }

  const msg = new MessageEmbed()

  if (game.price) msg.addField('Price', `$${game.price/100}`, true)
  if (game.size) msg.addField('Size', filesize(game.size), true)

  return msg
}

export function broadcast(webhooks: Webhook[], msg: string, game: Game): void {
  const embed = createEmbed(game)
  
  webhooks.forEach(webhook => {
    webhook.send(msg, { username, avatarURL, embeds: [embed] })
  })
}

export async function getAllWebhooks(ids: string[]): Promise<Webhook[] | null> {
  return await Promise.all(ids.map(id => client.fetchWebhook(id))) 
}