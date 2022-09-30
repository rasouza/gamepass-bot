import { Client } from 'discord.js'

export const createDiscord = () => {
  const client = new Client()

  client.login()
  return client
}
