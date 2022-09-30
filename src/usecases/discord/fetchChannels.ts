import 'reflect-metadata'
import { Client } from 'discord.js'
import { provide } from 'inversify-binding-decorators'
import { map } from 'lodash/fp'

import Subscription from '../../domain/Subscription'
import { SubscriptionDB } from '../../infrastructure/db'

@provide(FetchChannels)
export class FetchChannels {
  constructor(private discord: Client, private subsDB: SubscriptionDB) {}

  private async getAllWebhooks(subs: Subscription[]) {
    const fetchWebhook = (sub: Subscription) =>
      this.discord.fetchWebhook(sub.id)

    return await Promise.all(map(fetchWebhook)(subs))
  }

  public async execute() {
    // TODO: Wrap in Task (fp-ts)
    const subs = await this.subsDB.getAll()
    return await this.getAllWebhooks(subs)
  }
}
