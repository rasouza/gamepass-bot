import axios from 'axios'
import Logger from '../config/logger'
import Game from '../domain/Game'
import { XboxGame } from '../interfaces'

// TODO: #2 intercepts all requests and log it
const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

interface Sigls {
  id: string
}

function toDomain(game: XboxGame): Game {

  return new Game({
    id: game.StoreId,
    title: game.ProductTitle,
    developer: game.DeveloperName,
    image: game.ImageHero?.URI,
    price: Number(game.Price?.MSRP.slice(1))*100 || null,
    size: game.ApproximateSizeInBytes,
    description: game.ProductDescription
  })
}

export async function searchGames(ids: string[]): Promise<Game[]> {
  const params = {
    market: 'US',
    language: 'en-us',
    hydration: 'MobileDetailsForConsole'
  }

  const data = {
    'Products': ids
  }

  const resp = await client.post('/products', data, { params })
  const gameList: XboxGame[] = Object.values(resp.data.Products)
  
  return gameList.map(game => toDomain(game))
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

