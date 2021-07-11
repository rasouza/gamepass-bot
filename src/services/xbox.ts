import axios from 'axios'
import Logger from '../config/logger'

const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

interface Sigls {
  id: string
}

// TODO: return a list of products
async function getByIds(ids: string[]) {
  const params = {
    market: 'US',
    language: 'en-us',
    hydration: 'MobileDetailsForConsole'
  }

  const data = {
    'Products': ids
  }

  const resp = await client.post('/products', data, { params })
  Logger.silly(resp.data.Products)
  
  return resp.data.Products
}

export async function getCatalog() {
  const params = {
    id: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
    language: 'en-us',
    market: 'US'
  }
  const resp = await client.get('/sigls/v2', { params })
  const ids = resp.data.slice(1).map((game: Sigls) => game.id)
  Logger.debug(`Found ${ids.length} games`)

  const games = getByIds(ids)

  return games
}

