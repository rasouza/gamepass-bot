import { Collection, Message } from 'discord.js'
import { Command } from '@/interfaces'
import Settings from '@/config/settings'

import subscribe from '@/commands/subscribe'
import unsubscribe from '@/commands/unsubscribe'

const { prefix } = Settings
const commands: Collection<string, Command> = new Collection()
commands.set(subscribe.name, subscribe)
commands.set(unsubscribe.name, unsubscribe)

export default function messageHandler(message: Message): void {
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
