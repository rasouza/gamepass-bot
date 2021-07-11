import filesize from 'filesize'
import { Webhook, MessageEmbed } from 'discord.js'

import { username, avatarURL } from '../config/settings.json'
import { Embed, Game } from '../interfaces'

const MAX_LENGTH = 300

// TODO: Move to domain
export function gameEmbed({ title, description, developer, image, price, size}: Game): MessageEmbed {
  
  const config: Embed = {
    title,
    author: { name: developer },
    image: { url: image }
  }

  // Truncate large descriptions
  if (description.length > MAX_LENGTH) {
    config.description = `${description.slice(0, MAX_LENGTH)}...`
  } else {
    config.description = description
  }

  const msg = new MessageEmbed()

  if (price) msg.addField('Price', `$${price/100}`, true)
  if (size) msg.addField('Size', filesize(size), true)

  return msg
}

export function broadcast(webhooks: Webhook[], msg: string, embed: MessageEmbed) {
  webhooks.forEach(webhook => {
    webhook.send(msg, { username, avatarURL, embeds: [embed] })
  })
}