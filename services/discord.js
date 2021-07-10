const filesize = require('filesize')

const { WebhookClient, MessageEmbed } = require('discord.js')
const { username, avatarURL } = require('../config/settings.json')

const MAX_LENGTH = 300

exports.gameEmbed = ({ 
  ProductTitle: title, 
  DeveloperName: developer, 
  ImageHero: { URI: url }, 
  Price: { MSRP: price },
  ApproximateSizeInBytes: size,
  ProductDescription: description
}) => {
  const trimmedDescription = `${description.slice(0, MAX_LENGTH)}...`
  return new MessageEmbed({
    title,
    author: { name: developer },
    description: description.length < MAX_LENGTH ? description : trimmedDescription,
    image: { url }
  })
    .addField('Price', price, true)
    .addField('Size', filesize(size), true)
}

exports.send = (id, token, msg, embed) => {
  const webhook = new WebhookClient(id, token)

  webhook.send(msg, { username, avatarURL, embeds: [embed] })
}