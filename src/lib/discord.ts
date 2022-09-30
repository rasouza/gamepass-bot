import { Client, GatewayIntentBits } from 'discord.js'

export const createDiscord = () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  })

  client.login()
  return client
}
