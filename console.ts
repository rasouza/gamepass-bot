import dotenv from 'dotenv'
dotenv.config()

import repl from 'repl'
import { createClient } from '@supabase/supabase-js'
import { createLogin } from './src/services/discord'

import * as db from './src/services/supabase'
import * as xbox from './src/services/xbox'

import Game from './src/domain/Game'


const server = repl.start()

server.context.supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)
server.context.discord = createLogin(process.env.DISCORD_TOKEN || '')

// Services
server.context.db = db
server.context.xbox = xbox

// Domains
server.context.Game = Game