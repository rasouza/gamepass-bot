
import repl from 'repl'

import * as xbox from './src/services/xbox'

import GameDB from './src/models/game'
import SubscriptionDB from './src/models/subscription'

import Game from './src/domain/Game'
import Subscription from './src/domain/Subscription'

import dotenv from 'dotenv'
dotenv.config()
import { client as discord } from './src/services/discord' // eslint-disable-line import/first
import { client as supabase } from './src/models/base'// eslint-disable-line import/first

const server = repl.start()

server.context.discord = discord

// Services
server.context.xbox = xbox

// Models
server.context.supabase = supabase
server.context.GameDB = new GameDB()
server.context.SubscriptionDB = new SubscriptionDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription
