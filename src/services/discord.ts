import fs from 'fs'
import filesize from 'filesize'
import { Client, Collection, Webhook, MessageEmbed } from 'discord.js'

import { username, avatarURL } from '../config/settings.json'
import { Command, Embed } from '../interfaces'
import Game from '../domain/Game'

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
    const command = (await import(`../commands/${file}`)).default
    commands.set(command.name, command)
  })

  return commands
}

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

export function broadcast(webhooks: Webhook[], msg: string, embed: MessageEmbed): void {
  webhooks.forEach(webhook => {
    webhook.send(msg, { username, avatarURL, embeds: [embed] })
  })
}