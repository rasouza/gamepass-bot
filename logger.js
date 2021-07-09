const { createLogger, format, transports } = require('winston')
const devFormat = require('winston-dev-format')
const { env } = require('./config.json')

const { combine, timestamp, json, metadata, colorize } = format
const { Console } = transports

const isLocal = env === 'local'

// Note: Order matters!
const defaultFormat = combine(
  metadata(),
  timestamp(),
  json()
)

const localFormat = combine(
  colorize(),
  devFormat()
)

module.exports = createLogger({
  transports: [new Console()],
  exceptionHandlers: [new Console()],
  level: process.env.LOG_LEVEL || 'info',
  format: isLocal ? localFormat : defaultFormat
})
