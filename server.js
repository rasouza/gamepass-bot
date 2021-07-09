require('dotenv').config();

const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs')

const { prefix } = require('./config.json')


const client = new Client();
client.login(process.env.DISCORD_TOKEN)

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
})

client.on('ready', async () => {
  console.log('GamespassBot is ready!')
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

