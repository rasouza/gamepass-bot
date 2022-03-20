import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, timestamp, json, metadata, cli } = format
const { Console } = transports

const logs: winston.transport[] = []
const consoleFormat = combine(timestamp(), cli())
logs.push(
  new Console({
    format: consoleFormat
  })
)

// Note: Order matters!
const defaultFormat = combine(metadata(), timestamp(), json())

export default createLogger({
  transports: logs,
  exceptionHandlers: logs,
  level: process.env.LOG_LEVEL || 'info',
  format: defaultFormat
})
