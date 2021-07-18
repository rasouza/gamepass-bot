import Subscription from '../domain/Subscription.js'
import { SubscriptionModel } from '../interfaces/index.js'
import { DB } from './base.js'

export default class SubscriptionDB extends DB<SubscriptionModel, Subscription> {
  name = 'subscriptions'
}
