import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import Logger from '../config/logger'

import Game from '../domain/Game'
import { GameModel } from '../interfaces'
import { DB } from './base'


export default class GameDB extends DB<GameModel, Game> {
  constructor() {
    super('games')
  }

  async cleanupGamesBefore(date: Date): Promise<GameModel[] | null> {
    const { data, error } = await this.table.delete().lt('last_sync', date)
  
    if(data) data.forEach(game => Logger.info(`Cleaning up ${game.title}`))
    if (error) Logger.error(error)
  
    return data
  }

  onInsert(fnInsert: (payload: SupabaseRealtimePayload<GameModel>) => void): void {
    this.table.on('INSERT', payload => {
      Logger.debug('New game inserted', { game: payload.new })
      fnInsert(payload)
    }).subscribe()
  }
}

// export async function syncGame(id: string): Promise<GameModel | null> {
//   const date = new Date()
//   const { data, error } = await supabase.from<GameModel>('games').update({ last_sync: date }).eq('id', id).single()

//   Logger.debug(`${data?.title} updated at ${date.toISOString()}`)
//   if (error) Logger.error(error)

//   return data
// }

// export function parse ({ 
//   ProductTitle: title, 
//   DeveloperName: developer, 
//   ImageHero: image, 
//   Price: price,
//   ApproximateSizeInBytes: size,
//   ProductDescription: description,
//   StoreId: id
// }: XboxGame): Game {
//   const priceInt = price?.MSRP ? Math.round(Number(price.MSRP.slice(1))*100) : null

//   return {
//     id,
//     title, 
//     developer, 
//     image: image?.URI, 
//     price: priceInt, 
//     size, 
//     description
//   }
// }