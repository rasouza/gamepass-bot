import { SubscriptionModel } from '../interfaces/index.js'

export default class Subscription {
  id: string
  channel: string
  guild: string

  constructor (subscription: SubscriptionModel) {
    this.id = subscription.id
    this.channel = subscription.channel
    this.guild = subscription.guild
  }
}
