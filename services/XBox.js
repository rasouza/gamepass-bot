const axios = require('axios').default
const Logger = require('../config/logger')


const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

exports.getById = async id => {
  const params = {
    market: 'US',
    language: 'en-us',
    hydration: 'MobileDetailsForConsole'
  }

  const data = {
    'Products': [ id ]
  }

  const resp = await client.post('/products', data, { params })
  Logger.silly(resp.data.Products[id])
  
  return resp.data.Products[id]
}

exports.getCatalog = async () => {
  const params = {
    id: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
    language: 'en-us',
    market: 'US'
  }
  const resp = await client.get('/sigls/v2', { params })

  const games = resp.data.slice(1).map(game => game.id)

  return resp.data.slice(1)
}