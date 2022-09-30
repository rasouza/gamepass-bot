import { Client } from 'discord.js'
import { provide } from 'inversify-binding-decorators'

import { CommandHandler } from './command'
import { ReadyHandler } from './ready'

@provide(BotHandler)
export class BotHandler {
  constructor(
    private discord: Client,
    private readyHandler: ReadyHandler,
    private commandHandler: CommandHandler
  ) {}

  public start() {
    const onReady = this.readyHandler.run.bind(this.readyHandler)
    const onMessage = this.commandHandler.run.bind(this.commandHandler)

    this.discord.once('ready', onReady)
    this.discord.on('messageCreate', onMessage)
  }
}
