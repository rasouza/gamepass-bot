import { container } from '../config/container'
import { BotHandler } from '../handlers'

const bot = container.get<BotHandler>(BotHandler)

bot.start()
