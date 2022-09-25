import Subscription from 'domain/Subscription'
import { provide } from 'inversify-binding-decorators'
import { DB } from './base'

@provide(SubscriptionDB)
export default class SubscriptionDB extends DB<Subscription> {
  name = 'subscriptions'
}
