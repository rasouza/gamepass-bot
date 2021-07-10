const filesize = require('filesize')

const { WebhookClient, MessageEmbed } = require('discord.js')
const { username, avatarURL } = require('../config/settings.json')

const MAX_LENGTH = 300

exports.gameEmbed = ({ 
  title, 
  description,
  developer, 
  image, 
  price,
  size
}) => {
  const trimmedDescription = `${description.slice(0, MAX_LENGTH)}...`

  const msg = new MessageEmbed({
    title,
    author: { name: developer },
    description: description.length < MAX_LENGTH ? description : trimmedDescription,
    image: { url: image }
  })

  if (price) msg.addField('Price', `$${price/100}`, true)
  if (size) msg.addField('Size', filesize(size), true)

  return msg
}

exports.send = (id, token, msg, embed) => {
  const webhook = new WebhookClient(id, token)

  webhook.send(msg, { username, avatarURL, embeds: [embed] })
}