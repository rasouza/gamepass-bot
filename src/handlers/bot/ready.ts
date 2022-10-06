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

  private broadcastFor(type: string) {
    const me = this
    return function (game: Game) {
      me.broadcast.execute(
        type,
        'A new game has arrived!',
        me.gameEmbed.show(game)
      )
    }
  }

  public run() {
    this.onInsertXbox.execute(this.broadcastFor('xbox'))
    this.onInsertEpic.execute(this.broadcastFor('epic'))

    this.logger.info('Bot is ready!')
  }
}
