import 'module-alias/register'
import repl from 'repl'
import * as immutable from 'immutable'

import * as xbox from '@/services/xbox'

import GameDB from '@/models/game'
import SubscriptionDB from '@/models/subscription'

import Game from '@/domain/Game'
import Subscription from '@/domain/Subscription'

import { client as discord } from '@/services/discord'
import { client as supabase } from '@/models/base'

const server = repl.start()

server.context.immutable = immutable

// Services
server.context.discord = discord
server.context.xbox = xbox

// Models
server.context.supabase = supabase
server.context.gameDB = new GameDB()
server.context.subscriptionDB = new SubscriptionDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
