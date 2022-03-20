import axios from 'axios'
import Logger from 'config/logger'
import Game from 'domain/Game'
import { XboxGame } from 'interfaces'

const client = axios.create({
  baseURL: 'https://catalog.gamepass.com'
})

interface Sigls {
  id: string
}

// Add a request interceptor
client.interceptors.request.use(
  function (config) {
    Logger.debug('[XBox Service] request sent', { config })
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
client.interceptors.response.use(
  function (response) {
    Logger.debug('[XBox Service] got response', { response: response.data })
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

function toDomain(game: XboxGame): Game {
  return new Game({
    id: game.StoreId,
    title: game.ProductTitle,
    developer: game.DeveloperName,
    image: game.ImageHero?.URI,
    price: Math.round(Number(game.Price?.MSRP.slice(1)) * 100) || null,
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
    Products: ids
  }

  const resp = await client.post('/products', data, { params })
  const gameList: XboxGame[] = Object.values(resp.data.Products)

  return gameList.map((game) => toDomain(game))
}

export async function getIdCatalog(): Promise<string[]> {
  const params = {
    id: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
    language: 'en-us',
    market: 'US'
  }
  const sigls: Sigls[] = (await client.get('/sigls/v2', { params })).data.slice(
    1
  )
  Logger.debug(`Found ${sigls.length} games`)

  return sigls.map((sigl) => sigl.id)
}
