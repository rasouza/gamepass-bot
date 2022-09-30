import { Client, Message } from 'discord.js'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Game from '../domain/Game'
import { GameEmbed } from '../presenters'
import { Broadcast, OnInsertXbox } from '../usecases'

@provide(BotHandler)
export class BotHandler {
  constructor(
    private discord: Client,
    private broadcast: Broadcast,
    private onInsertXbox: OnInsertXbox,
    private gameEmbed: GameEmbed,
    @inject('Logger') private logger: Logger
  ) {}

  private onReady() {
    this.onInsertXbox.execute((game: Game) =>
      this.broadcast.execute(
        'A new game has arrived!',
        this.gameEmbed.show(game)
      )
    )
    this.logger.info('Bot is ready!')
  }

  private onMessage(message: Message) {}

  public start() {
    this.discord.once('ready', this.onReady.bind(this))
    this.discord.on('message', this.onMessage.bind(this))
  }
}
