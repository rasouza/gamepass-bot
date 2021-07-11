import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js'
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder'
import Logger from '../config/logger'

export const client = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)

interface PK {
  id: string | number
}

export abstract class DB<Model extends PK, Domain> {
  table: SupabaseQueryBuilder<Model>

  constructor(table: string) {
    this.table = client.from<Model>(table)
  }

  async getAll(): Promise<Model[] | null> {
    const { data, error } = await this.table.select('*')
    if (error) Logger.error(error)

    return data
  }

  async getById(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.table.select('*').eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }

  async insert(domain: Domain): Promise<Model | null> {
    const { data, error } = await this.table.insert(domain).single()
    
    if (error) Logger.error(error)
    return data
  }

  async update(id: Model[keyof Model], model: Model): Promise<Model | null> {
    const { data, error } = await this.table.update(model).eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }

  async delete(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.table.delete().eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }
}
