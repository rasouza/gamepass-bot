import { Collection, Message } from 'discord.js'
import { multiInject } from 'inversify'
import { provide } from 'inversify-binding-decorators'

import Settings from '../../config/settings'

const { prefix } = Settings

// TODO: extract this interface
export interface Command {
  name: string
  description: string
  execute: (message: Message, args: string[]) => void
}

@provide(CommandHandler)
export class CommandHandler {
  private commands: Collection<string, Command> = new Collection()

  constructor(
    @multiInject('Command')
    commands: Command[]
  ) {
    commands.forEach((command) => this.commands.set(command.name, command))
  }

  public run(message: Message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command || !this.commands.has(command)) return
    try {
      this.commands.get(command)?.execute(message, args)
    } catch (error) {
      console.error(error)
      message.reply('There was an error trying to execute that command')
    }
  }
}
