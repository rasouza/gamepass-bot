const { createClient } = require('@supabase/supabase-js')
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
