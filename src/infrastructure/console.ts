import repl from 'repl'
import * as immutable from 'immutable'

import * as xbox from 'services/xbox'
import { client as discord } from 'services/discord'

import GameDB from 'models/game'
import SubscriptionDB from 'models/subscription'

import Game from 'domain/Game'
import Subscription from 'domain/Subscription'
import { container } from 'config/container'
import { SupabaseClient } from '@supabase/supabase-js'
import { FetchList } from 'usecases/xbox/fetchList'
import { EnrichGames } from 'usecases'
import { XboxSync } from 'handlers/sync'

const supabase = container.get<SupabaseClient>(SupabaseClient)
const subscriptionDB = container.get<SubscriptionDB>(SubscriptionDB)
const gameDB = container.get<GameDB>(GameDB)
const fetchList = container.get<FetchList>(FetchList)
const enrichGames = container.get<EnrichGames>(EnrichGames)
const xboxSync = container.get<XboxSync>(XboxSync)

const server = repl.start()
Object.assign(server.context, {
  immutable,
  discord,
  xbox,
  supabase,
  Game,
  Subscription,
  subscriptionDB,
  gameDB,
  fetchList,
  enrichGames,
  xboxSync,
  container
})

server.context.gameDB = new GameDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
