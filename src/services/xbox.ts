import axios from 'axios'
import Logger from '../config/logger'
import { XboxGame } from '../interfaces'

// TODO: #2 intercepts all requests and log it
const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

interface Sigls {
  id: string
}

interface XboxGameList {
  [index: string]: XboxGame
}

export async function searchGames(ids: string[]): Promise<XboxGame[]> {
  const params = {
    market: 'US',
    language: 'en-us',
    hydration: 'MobileDetailsForConsole'
  }

  const data = {
    'Products': ids
  }

  const resp = await client.post('/products', data, { params })
  const gameList: XboxGameList = resp.data.Products
  
  return Object.values(gameList)
}

export async function getIdCatalog(): Promise<string[]> {
  const params = {
    id: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
    language: 'en-us',
    market: 'US'
  }
  const sigls: Sigls[] = (await client.get('/sigls/v2', { params })).data.slice(1)
  Logger.debug(`Found ${sigls.length} games`)

  return sigls.map(sigl => sigl.id)
}

