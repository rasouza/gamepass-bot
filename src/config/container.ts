import { Container, interfaces } from 'inversify'
import { Client } from 'discord.js'
import { buildProviderModule } from 'inversify-binding-decorators'
import { SupabaseClient } from '@supabase/supabase-js'
import { AxiosInstance } from 'axios'
import { Logger as WinstonLogger } from 'winston'

import { axiosFactory } from './axios'
import { createSupabase } from './supabase'
import { createDiscord } from './discord'
import Logger from './logger'

import '../usecases'
import '../models'
import '../presenters'
import '../handlers'

const container = new Container()

// Factories
container
  .bind<interfaces.Factory<AxiosInstance>>('AxiosFactory')
  .toFactory<AxiosInstance, [string, string]>(axiosFactory)

// Bindings
container.bind<Client>(Client).toConstantValue(createDiscord())
container.bind<SupabaseClient>(SupabaseClient).toConstantValue(createSupabase())
container.bind<WinstonLogger>('Logger').toConstantValue(Logger)

// Custom Clients
const createAxios =
  container.get<interfaces.Factory<AxiosInstance>>('AxiosFactory')
const xboxClient = createAxios(
  'XBox Service',
  'https://catalog.gamepass.com'
) as AxiosInstance

container
  .bind<AxiosInstance>('HttpClient')
  .toConstantValue(xboxClient)
  .whenTargetNamed('xbox')

// Load Providers
container.load(buildProviderModule())

export { container }
