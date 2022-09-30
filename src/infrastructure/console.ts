import repl from 'repl'
import { SupabaseClient } from '@supabase/supabase-js'
import { Client } from 'discord.js'

import { container } from '../config/container'

import GameDB from './db/repositories/game'
import SubscriptionDB from './db/repositories/subscription'

const discord = container.get<Client>(Client)
const supabase = container.get<SupabaseClient>(SupabaseClient)

const subscriptionDB = container.get<SubscriptionDB>(SubscriptionDB)
const gameDB = container.get<GameDB>(GameDB)

const server = repl.start()
Object.assign(server.context, {
  discord,
  supabase,
  subscriptionDB,
  gameDB,
  container
})
