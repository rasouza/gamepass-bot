import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

import Game from '../../domain/Game'
import { GameEmbed } from '../../presenters'
import { Broadcast, OnInsertEpic, OnInsertXbox } from '../../usecases'

@provide(ReadyHandler)
export class ReadyHandler {
  constructor(
    private broadcast: Broadcast,
    private onInsertXbox: OnInsertXbox,
    private onInsertEpic: OnInsertEpic,
    private gameEmbed: GameEmbed,
    @inject('Logger') private logger: Logger
  ) {}

  public run() {
    this.onInsertXbox.execute((game: Game) =>
      this.broadcast.execute(
        'xbox',
        'A new game has arrived!',
        this.gameEmbed.show(game)
      )
    )

    this.onInsertEpic.execute((game: Game) => {
      this.broadcast.execute(
        'epic',
        'A new game has arrived!',
        this.gameEmbed.show(game)
      )
    })
    this.logger.info('Bot is ready!')
  }
}
