import fs from 'fs'
import filesize from 'filesize'
import { Client, Collection, Webhook, MessageEmbed } from 'discord.js'

import { username, avatarURL } from '../config/settings.json'
import { Command, Embed, Game } from '../interfaces'
import Logger from '../config/logger'

const MAX_LENGTH = 300

export function createLogin(token: string): Client {
  const client = new Client();
  client.login(token)

  return client
}

export function loadCommands(path: string): Collection<string, Command> {
  const commands: Collection<string, Command> = new Collection()
  const commandFiles = fs.readdirSync(path).filter((file: string) => file.endsWith('.ts'))
  commandFiles.forEach(async file => {
    const command = await import(`${path}/${file}`)
    commands.set(command.name, command)
  })

  return commands
}

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

export function broadcast(webhooks: Webhook[], msg: string, embed: MessageEmbed): void {
  webhooks.forEach(webhook => {
    webhook.send(msg, { username, avatarURL, embeds: [embed] })
  })
}