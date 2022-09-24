import repl from 'repl'
import * as immutable from 'immutable'

import * as xbox from 'services/xbox'
import { client as discord, Discord } from 'services/discord'

import GameDB from 'models/game'
import SubscriptionDB from 'models/subscription'

import Game from 'domain/Game'
import Subscription from 'domain/Subscription'
import { container } from 'inversify.config'

const discordC = container.get<Discord>(Discord)

import { client as supabase } from 'models/base'

const server = repl.start()
Object.assign(server.context, {
  immutable,
  discord,
  xbox,
  supabase,
  Game,
  Subscription,
  discordC
})

server.context.gameDB = new GameDB()
server.context.subscriptionDB = new SubscriptionDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
