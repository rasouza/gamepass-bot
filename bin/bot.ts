import dotenv from 'dotenv'
dotenv.config()

import Sentry from '../src/config/sentry.js'
import messageHandler from '../src/handlers/message.js'
import readyHandler from '../src/handlers/ready.js'
import { client } from '../src/services/discord.js'

client.on('ready', readyHandler)
client.on('message', messageHandler)

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error)
  throw error
})

process.on('uncaughtException', (error) => {
  Sentry.captureException(error)
  throw error
})
