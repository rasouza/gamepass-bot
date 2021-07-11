import { GameModel, SubscriptionModel } from '../interfaces'
import Logger from '../config/logger'
import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js'
import Game from '../domain/Game'

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)

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

// TODO: #5 Separate Models
export async function getGameById(id: string): Promise<GameModel | null> {
  const { data, error } = await supabase.from<GameModel>('games').select('*').eq('id', id).single()
  if (error) Logger.error(error)

  return data
}

export async function insertGame(game: Game): Promise<GameModel | null> {
  const { data, error } = await supabase.from<GameModel>('games').insert(game).maybeSingle()
  
  if (error) Logger.error(error)
  return data
}

export async function syncGame(id: string): Promise<GameModel | null> {
  const date = new Date()
  const { data, error } = await supabase.from<GameModel>('games').update({ last_sync: date }).eq('id', id).single()

  Logger.debug(`${data?.title} updated at ${date.toISOString()}`)
  if (error) Logger.error(error)

  return data
}

export async function cleanupGamesBefore(date: Date): Promise<GameModel[] | null> {
  const { data, error } = await supabase.from<GameModel>('games').delete().lt('last_sync', date)

  if(data) data.forEach(game => Logger.info(`Cleaning up ${game.title}`))
  if (error) Logger.error(error)

  return data
}

export async function newSubscription(channel: string, webhook: string): Promise<SubscriptionModel|null> {
  const { data, error } = await supabase.from<SubscriptionModel>('subscriptions').insert({ channel: channel, webhook }).single()

  if (error) Logger.error(error)

  return data
}

export async function getSubscriptions(): Promise<SubscriptionModel[]|null> {
  const { data, error } = await supabase.from<SubscriptionModel>('subscriptions').select();

  if (error) Logger.error(error)

  return data
}

export async function deleteSubscription(channel: string): Promise<SubscriptionModel[]|null> {
  const { data, error } = await supabase.from<SubscriptionModel>('subscriptions').delete().eq('channel', channel);

  if (error) Logger.error(error)

  return data
}

export function onInsert(fnInsert: (payload: SupabaseRealtimePayload<Game>) => void) {
  supabase.from('games').on('INSERT', async payload => {
    Logger.debug(payload.new)
    await fnInsert(payload)
  }).subscribe()
}