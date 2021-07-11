import dotenv from 'dotenv'
dotenv.config()

import { Client, Collection } from 'discord.js'
import fs from 'fs'

import { Command } from './src/interfaces'
import Sentry from './src/config/sentry'
import Logger from './src/config/logger'
import { prefix, username } from './src/config/settings.json'
import { gameEmbed, broadcast } from './src/services/discord'
import { getSubscriptions, onInsert } from "./src/services/supabase";

const client = new Client();
client.login(process.env.DISCORD_TOKEN)

// Load all commands
const commands: Collection<string, Command> = new Collection()
const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.ts'))
commandFiles.forEach(async (file: string) => {
  const command = await import(`./src/commands/${file}`)
  commands.set(command.name, command)
})

client.on('ready', async () => {
  const subscriptions = await getSubscriptions()
  if (!subscriptions) return 

  const webhooks = await Promise.all(subscriptions.map(sub => client.fetchWebhook(sub.webhook)))

  onInsert((payload) => {
    const game = gameEmbed(payload.new)
    broadcast(webhooks, 'A new game has arrived!', game)
  })
  Logger.info(`${username} is ready!`)
})

client.on('message', async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift()!.toLowerCase()

  if (!commands.has(command)) return

  try {
    commands.get(command)!.execute(msg, args)
  } catch (error) {
    console.error(error)
    msg.reply('There was an error trying to execute that command')
  }
})

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error)
  Logger.error(error);
})

process.on('uncaughtException', (error) => {
  Sentry.captureException(error)
  Logger.error(error);
})