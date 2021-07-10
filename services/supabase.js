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

exports.newSubscription = async (channel, webhook) => {
  const { data, error } = await supabase.from('channels').insert({ id: channel, webhook })

  if (error) logger.error(error)

  return data
}