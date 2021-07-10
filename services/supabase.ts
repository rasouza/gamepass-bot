import { Game, Subscription, XboxGame } from './_types'
import Logger from '../config/logger'
import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)

export function parse ({ 
  ProductTitle: title, 
  DeveloperName: developer, 
  ImageHero: image, 
  Price: price,
  ApproximateSizeInBytes: size,
  ProductDescription: description,
  StoreId: id
}: XboxGame): Game {
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

exports.getGameById = async id => {
  const { data, error } = await supabase.from('games').select('*').eq('id', id).maybeSingle()
  if (error) Logger.error(error)

  return data
}

exports.insertGame = async game => {
  const { data, error } = await supabase.from('games').insert(game)
  
  if (error) Logger.error(error)
  return data
}

exports.syncGame = async id => {
  const date = new Date()
  const { data, error } = await supabase.from('games').update({ last_sync: date }).eq('id', id).single()

  Logger.debug(`${data.title} updated at ${date.toISOString()}`)
  if (error) Logger.error(error)

  return data
}

exports.cleanupGamesBefore = async date => {
  const { data, error } = await supabase.from('games').delete().lt('last_sync', date)
  data.forEach(game => Logger.info(`Cleaning up ${game.title}`))

  if (error) Logger.error(error)

  return data
}

exports.newSubscription = async (channel, webhook) => {
  const { data, error } = await supabase.from('subscriptions').insert({ channel: channel, webhook })

  if (error) Logger.error(error)

  return data
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase.from('subscriptions').select();

  if (error) Logger.error(error)

  return data
}

exports.deleteSubscription = async channel => {
  const { data, error } = await supabase.from('subscriptions').delete().eq('channel', channel);

  if (error) Logger.error(error)

  return data
}

export function onInsert(fnInsert: (payload: SupabaseRealtimePayload<Game>) => void) {
  supabase.from('games').on('INSERT', async payload => {
    Logger.debug(payload.new)
    await fnInsert(payload)
  }).subscribe()
}