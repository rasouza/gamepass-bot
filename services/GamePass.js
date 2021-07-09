const axios = require('axios').default

const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

exports.getById = async id => {
  
  const resp = await client.post('/products?market=US&language=en-US&hydration=MobileDetailsForConsole', {
    "Products": [ id ]
  })

  return resp.data.Products[id]
}