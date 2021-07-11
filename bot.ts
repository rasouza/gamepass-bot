import dotenv from 'dotenv'
dotenv.config()

import Sentry from './src/config/sentry'
import Logger from './src/config/logger'
import { prefix, username } from './src/config/settings.json'
import { createEmbed, broadcast, createLogin, loadCommands } from './src/services/discord'
import { getSubscriptions, onInsert } from "./src/services/supabase";
import Game from './src/domain/Game'

const COMMAND_PATH = './src/commands'

const client = createLogin(process.env.DISCORD_TOKEN)
const commands = loadCommands(COMMAND_PATH)

client.on('ready', async () => {
  const subscriptions = await getSubscriptions()
  if (!subscriptions) return 

  const webhooks = await Promise.all(subscriptions.map(sub => client.fetchWebhook(sub.webhook)))

  onInsert((payload) => {
    const game = new Game(payload.new)
    const gameEmbed = createEmbed(payload.new)
    broadcast(webhooks, 'A new game has arrived!', gameEmbed)
  })
  Logger.info(`${username} is ready!`)
})

client.on('message', async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift()?.toLowerCase()

  if (!commands.has(command)) return

  try {
    commands.get(command)?.execute(msg, args)
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