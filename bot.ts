import dotenv from 'dotenv'
dotenv.config()

import Sentry from './src/config/sentry'

import { client } from './src/services/discord'
import messageHandler from './src/handlers/message'
import readyHandler from './src/handlers/ready'

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