export default class Subscription {
  id: string
  channel: string
  guild: string

  constructor(subscription: any) {
    this.id = subscription.id
    this.channel = subscription.channel
    this.guild = subscription.guild
  }
}
