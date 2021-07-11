import { createClient } from '@supabase/supabase-js'
import Logger from '../config/logger'

export const client = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string)

interface PK {
  id: string | number
}

export abstract class DB<Model extends PK, Domain> {
  name: string
  client = client

  constructor(name: string) {
    this.name = name

  }

  async getAll(): Promise<Model[] | null> {
    const { data, error } = await this.client.from<Model>(this.name).select('*')
    if (error) Logger.error(error)

    return data
  }

  async getAllById(ids: Model[keyof Model][]): Promise<Model[] | null> {
    const { data, error } = await this.client.from<Model>(this.name).select('*').in('id', ids)
    if (error) Logger.error(error)

    return data
  }

  async getById(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.client.from<Model>(this.name).select('*').eq('id', id).maybeSingle()
    if (error) Logger.error(error)

    return data
  }

  async insert(domain: Domain | Domain[]): Promise<Model | Model[] | null> {
    const { data, error } = await this.client.from<Model>(this.name).insert(domain)
    
    if (error) Logger.error(error)
    return data
  }

  async update(id: Model[keyof Model], model: Model): Promise<Model | null> {
    const { data, error } = await this.client.from<Model>(this.name).update(model).eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }

  async delete(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.client.from<Model>(this.name).delete().eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }

  async exists(id: Model[keyof Model]): Promise<boolean | null> {
    const { data, error } = await this.client.from<Model>(this.name).select('*').eq('id', id).maybeSingle()
    if (error) Logger.error(error)

    return !!data
  }
}
