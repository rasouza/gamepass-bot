require('dotenv').config();

const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs')

const Sentry = require('./config/sentry')
const Logger = require('./config/logger')

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error)
  Logger.error(error);
})

process.on('uncaughtException', (error) => {
  Sentry.captureException(error)
  Logger.error(error);
})

const { prefix, username } = require('./config/settings.json')
const discord = require('./services/discord')
const db = require('./services/supabase')

const client = new Client();
client.login(process.env.DISCORD_TOKEN)

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
})

client.on('ready', async () => {
  const subscriptions = await db.getSubscriptions()
  const webhooks = await Promise.all(subscriptions.map(sub => client.fetchWebhook(sub.webhook)))

  db.onInsert(payload => {
    const game = discord.gameEmbed(payload.new)
    discord.broadcast(webhooks, 'A new game has arrived!', game)
  })
  Logger.info(`${username} is ready!`)
})

client.on('message', async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (!client.commands.has(command)) return

  try {
    client.commands.get(command).execute(msg, args)
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