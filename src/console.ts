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
// import { FetchChannels } from 'usecases/discord/fetchChannels'

const supabase = container.get<SupabaseClient>(SupabaseClient)
const subscriptionDB = container.get<SubscriptionDB>(SubscriptionDB)
const fetchList = container.get<FetchList>(FetchList)
// const fetchChannels = container.get<FetchChannels>(FetchChannels)

const server = repl.start()
Object.assign(server.context, {
  immutable,
  discord,
  xbox,
  supabase,
  Game,
  Subscription,
  subscriptionDB,
  // fetchChannels
  fetchList,
  container
})

server.context.gameDB = new GameDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
