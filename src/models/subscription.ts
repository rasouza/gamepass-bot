import Subscription from '@/domain/Subscription'
import { SubscriptionModel } from '@/interfaces'
import { DB } from './base'

export default class SubscriptionDB extends DB<SubscriptionModel, Subscription> {
  name = 'subscriptions'
}
