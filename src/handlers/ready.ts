import { getAllWebhooks, broadcast } from '../services/discord.js'
import SubscriptionDB from '../models/subscription.js'
import GameDB from '../models/game.js'
import Logger from '../config/logger.js'

const subDB = new SubscriptionDB()
const gameDB = new GameDB()

export default async function readyHandler (): Promise<void> {
  const subs = await subDB.getAll()
  if (!subs) return

  const webhooks = await getAllWebhooks(subs.map(sub => sub.id))
  if (!webhooks) return

  gameDB.onInsert(game => broadcast(webhooks, 'A new game has arrived!', game))

  Logger.info('Bot is ready!')
}
