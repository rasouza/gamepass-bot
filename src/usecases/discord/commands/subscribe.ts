import { Message } from 'discord.js'
import { inject, LazyServiceIdentifer } from 'inversify'
import { provide } from 'inversify-binding-decorators'

import { FetchChannels } from '../..'

@provide(SubscribeCommand)
export class SubscribeCommand {
  public name = 'subscribe'
  public description = 'Subscribe channel for game offers'

  constructor(
    @inject(new LazyServiceIdentifer(() => FetchChannels))
    private fetchChannels: FetchChannels
  ) {}

  public async execute(message: Message) {}
}
