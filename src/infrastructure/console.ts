import repl from 'repl'

import { container } from '../inversify.config'

import { BotHandler } from '../handlers'

const server = repl.start()

container.get<BotHandler>(BotHandler)
Object.assign(server.context, {
  container
})
