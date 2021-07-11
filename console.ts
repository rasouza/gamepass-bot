import dotenv from 'dotenv'
dotenv.config()

import repl from 'repl'
import { createClient } from '@supabase/supabase-js'
import { client as discord } from './src/services/discord'

import * as xbox from './src/services/xbox'

import { client } from './src/models/base'
import GameDB from './src/models/game'
import SubscriptionDB from './src/models/subscription'

import Game from './src/domain/Game'
import Subscription from './src/domain/Subscription'

const server = repl.start()

server.context.supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)
server.context.discord = discord

// Services
server.context.xbox = xbox

// Models
server.context.db = client
server.context.GameDB = new GameDB()
server.context.SubscriptionDB = new SubscriptionDB()

// Domains
server.context.Game = Game
server.context.Subscription = Subscription