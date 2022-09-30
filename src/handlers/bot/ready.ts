import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Game from '../../domain/Game'
import { GameEmbed } from '../../presenters'
import { Broadcast, OnInsertXbox } from '../../usecases'

@provide(ReadyHandler)
export class ReadyHandler {
  constructor(
    private broadcast: Broadcast,
    private onInsertXbox: OnInsertXbox,
    private gameEmbed: GameEmbed,
    @inject('Logger') private logger: Logger
  ) {}

  public run() {
    this.onInsertXbox.execute((game: Game) =>
      this.broadcast.execute(
        'A new game has arrived!',
        this.gameEmbed.show(game)
      )
    )
    this.logger.info('Bot is ready!')
  }
}
