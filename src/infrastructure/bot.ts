import { container } from '../inversify.config'
import { BotHandler } from '../handlers'

const bot = container.get<BotHandler>(BotHandler)

bot.start()
