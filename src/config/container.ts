import { Container } from 'inversify'
import { Client } from 'discord.js'
import { buildProviderModule } from 'inversify-binding-decorators'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_KEY } = process.env

const createDiscord = () => new Client()
const createSupabase = () =>
  createClient(SUPABASE_URL as string, SUPABASE_KEY as string)

const container = new Container()
container.bind<Client>(Client).toDynamicValue(createDiscord)
container.bind<SupabaseClient>(SupabaseClient).toDynamicValue(createSupabase)
// TODO: Axios conditional binding
container.load(buildProviderModule())
export { container }
