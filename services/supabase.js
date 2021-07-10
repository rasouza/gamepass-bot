const { createClient } = require('@supabase/supabase-js')
const logger = require('../config/logger')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

exports.parse = ({ 
  ProductTitle: title, 
  DeveloperName: developer, 
  ImageHero: image, 
  Price: price,
  ApproximateSizeInBytes: size,
  ProductDescription: description,
  StoreId: id
}) => {
  const priceInt = price?.MSRP ? Math.round(Number(price.MSRP.slice(1))*100) : null

  return {
    id,
    title, 
    developer, 
    image: image?.URI, 
    price: priceInt, 
    size, 
    description
  }
}

exports.getGameById = async id => {
  const { data, error } = await supabase.from('games').select('*').eq('id', id)

  if (error) Logger.error(error)
  if (data.length === 0) return null

  return data[0]
}

exports.insertGame = async game => {
  const { data, error } = await supabase.from('games').insert(game)
  
  if (error) Logger.error(error)
  return data
}

exports.syncGame = async id => {
  const date = new Date()
  const { data, error } = await supabase.from('games').update({ last_sync: date }).eq('id', id)
  
  Logger.debug(`${data.title} updated at ${date.toISOString()}`)
  if (error) Logger.error(error)

  return data
}

exports.cleanupGamesBefore = async date => {
  const { data, error } = await supabase.from('games').delete().lt('last_sync', date)
  data.forEach(game => Logger.info(`Cleaning up ${game.title}`))

  if (error) Logger.error(error)

  return data
}

exports.newSubscription = async (channel, webhook) => {
  const { data, error } = await supabase.from('channels').insert({ id: channel, webhook })

  if (error) logger.error(error)

  return data
}