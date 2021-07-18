import dotenv from 'dotenv'
dotenv.config()

import repl from 'repl'
import * as immutable from 'immutable'

import * as xbox from '../src/services/xbox.js'

import GameDB from '../src/models/game.js'
import SubscriptionDB from '../src/models/subscription.js'

import Game from '../src/domain/Game.js'
import Subscription from '../src/domain/Subscription.js'

import { client as discord } from '../src/services/discord.js'
import { client as supabase } from '../src/models/base.js'

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
