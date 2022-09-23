import repl from 'repl'
import * as immutable from 'immutable'

import * as xbox from 'services/xbox'
import * as epic from 'services/epic'
import { client as discord } from 'services/discord'

import GameDB from 'models/game'
import SubscriptionDB from 'models/subscription'
import { client as supabase } from 'models/base'

import Game from 'domain/Game'
import Subscription from 'domain/Subscription'

const server = repl.start()

server.context.immutable = immutable

// Services
server.context.discord = discord
server.context.xbox = xbox
server.context.epic = epic

// Models
server.context.supabase = supabase
server.context.gameDB = new GameDB()
server.context.subscriptionDB = new SubscriptionDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
