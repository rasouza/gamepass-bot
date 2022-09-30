import { provide } from 'inversify-binding-decorators'

import { DB } from './base'
import Subscription from '../../../domain/Subscription'

@provide(SubscriptionDB)
export default class SubscriptionDB extends DB<Subscription> {
  name = 'subscriptions'
}