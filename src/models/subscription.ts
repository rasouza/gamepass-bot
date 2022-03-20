import Subscription from 'domain/Subscription'
import { DB } from './base'

export default class SubscriptionDB extends DB<Subscription> {
  name = 'subscriptions'
}
