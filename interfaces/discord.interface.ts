import { Message } from 'discord.js'

export interface Command {
  name: string,
  description: string,
  execute: (message: Message, args: string[]) => void
}

interface EmbedAuthor {
  name?: string,
  icon_url?: string,
  url?: string
}

interface EmbedImage {
  url: string | null
}

interface EmbedField {
  name: string,
  value: string
}

interface EmbedFooter {
  text?: string,
  icon_url?: string
}

export interface Embed {
  color?: string,
  title?: string,
  url?: string,
  author?: EmbedAuthor,
  description?: string,
  thumbnail?: EmbedImage,
  fields?: EmbedField[],
  image?: EmbedImage,
  timestamp?: Date,
  footer?: EmbedFooter
}