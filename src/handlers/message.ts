import fs from 'fs'

import { Collection, Message } from 'discord.js'
import { Command } from '../interfaces'
import { prefix } from '../config/settings.json'

const COMMAND_RELATIVE = '../commands'
const COMMAND_ABSOLUTE = './src/commands'

const commands: Collection<string, Command> = new Collection()
const commandFiles = fs.readdirSync(COMMAND_ABSOLUTE).filter((file: string) => file.endsWith('.ts'))
commandFiles.forEach(async file => {
  const command = (await import(`${COMMAND_RELATIVE}/${file}`)).default
  commands.set(command.name, command)
})

export default function messageHandler (message: Message): void {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift()?.toLowerCase()
  if (!command || !commands.has(command)) return

  try {
    commands.get(command)?.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command')
  }
}
