import { Container, interfaces } from 'inversify'
import { Client } from 'discord.js'
import { buildProviderModule } from 'inversify-binding-decorators'
import { SupabaseClient } from '@supabase/supabase-js'
import { AxiosInstance } from 'axios'
import { Logger as WinstonLogger } from 'winston'

import { axiosFactory } from './lib/axios'
import { createSupabase } from './infrastructure/db/supabase'
import { createDiscord } from './lib/discord'
import Logger from './lib/winston'

import './presenters'
import './infrastructure/db/repositories'
import './usecases'
import './handlers'

const container = new Container()

// Factories
container
  .bind<interfaces.Factory<AxiosInstance>>('AxiosFactory')
  .toFactory<AxiosInstance, [string, string]>(axiosFactory)

// Bindings
container.bind<Client>(Client).toDynamicValue(() => createDiscord())
container
  .bind<SupabaseClient>(SupabaseClient)
  .toDynamicValue(() => createSupabase())
container.bind<WinstonLogger>('Logger').toConstantValue(Logger)

// Custom Clients
const createAxios =
  container.get<interfaces.Factory<AxiosInstance>>('AxiosFactory')

const xboxClient = createAxios(
  'XBox Service',
  'https://catalog.gamepass.com'
) as AxiosInstance
const epicClient = createAxios(
  'Epic Service',
  'https://store-site-backend-static-ipv4.ak.epicgames.com'
) as AxiosInstance

container
  .bind<AxiosInstance>('HttpClient')
  .toConstantValue(xboxClient)
  .whenTargetNamed('xbox')
container
  .bind<AxiosInstance>('HttpClient')
  .toConstantValue(epicClient)
  .whenTargetNamed('epic')

// Load Providers
container.load(buildProviderModule())

export { container }
