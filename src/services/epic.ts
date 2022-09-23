import axios from 'axios'
import { merge } from 'object-mapper'
import { pipe, map, curryRightN, filter, isEmpty } from 'lodash/fp'

import Logger from 'config/logger'
import schema from './schemas/epic'

const mergeFP = curryRightN(2, merge)

const client = axios.create({
  baseURL: 'https://store-site-backend-static-ipv4.ak.epicgames.com'
})

// Add a request interceptor
client.interceptors.request.use(
  function (config) {
    Logger.debug('[Epic Service] request sent', { config })
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
    Logger.debug('[Epic Service] got response', { response: response.data })
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export async function fetch() {
  const resp = await client.get('/freeGamesPromotions')

  return resp.data.data.Catalog.searchStore.elements
}

// TODO: remove any types
export function transform(list: any) {
  const hasOffer = (game: any) => !isEmpty(game.offer)
  const parseGames = pipe(map(mergeFP(schema)), filter(hasOffer))
  return parseGames(list)
}

export async function print() {
  const list = await fetch()
  const games = transform(list)
  console.dir(games, { depth: null })
}
