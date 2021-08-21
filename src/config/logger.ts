import winston from 'winston'
import LogDnaWinston from 'logdna-winston'
import devFormat from 'winston-dev-format'

const { createLogger, format, transports } = winston
const { combine, timestamp, json, metadata, colorize } = format
const { Console } = transports

const isLocal = process.env.NODE_ENV === 'local'

const logs: winston.transport[] = []
if (process.env.LOGDNA_KEY) {
  logs.push(
    new LogDnaWinston({
      key: process.env.LOGDNA_KEY,
      indexMeta: true,
      handleExceptions: true,
      app: 'gamepass-bot'
    })
  )
}
logs.push(new Console())

// Note: Order matters!
const defaultFormat = combine(metadata(), timestamp(), json())

const localFormat = combine(colorize(), devFormat())

export default createLogger({
  transports: logs,
  exceptionHandlers: logs,
  level: process.env.LOG_LEVEL || 'info',
  format: isLocal ? localFormat : defaultFormat
})
