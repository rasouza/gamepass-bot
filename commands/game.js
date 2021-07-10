const { MessageEmbed } = require('discord.js')
const size = require('filesize')
const Gamepass = require('../services/xbox')
const Logger = require('../config/logger')

const buildMsg = game => {
  const description = game.ProductDescription.length > 300 ? `${game.ProductDescription.slice(0, 300)}...` : game.ProductDescription
  const preco = (game.ApproximateSizeInBytes / (1024*1024*1024)) / Number(game.Price.MSRP.slice(1))

  return new MessageEmbed({
    title: game.ProductTitle,
    author: {
      name: game.DeveloperName
    },
    description,
    image: {
      url: game.ImageHero.URI
    },
    fields: [
      {
        name: 'Price',
        value: game.Price.MSRP,
        inline: true
      },
      {
        name: 'Size',
        value: size(game.ApproximateSizeInBytes),
        inline: true
      },
      {
        name: 'Preço do Kilo do Giga',
        value: `$${Math.round(preco*100) / 100}/GB`,
        inline: true
      }
    ]
  })
}

module.exports = {
  name: 'game',
  description: 'Show a game',
  async execute(message, args) {
    const game = await Gamepass.getById('BQ1W1T1FC14W')
    const gameMsg = buildMsg(game)

    Logger.debug(game)
    message.channel.send(gameMsg)
  }
}