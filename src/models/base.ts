import { createClient } from '@supabase/supabase-js'
import Logger from '@/config/logger'

export const client = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
)

interface PK {
  id: string | number
}

export abstract class DB<Model extends PK> {
  abstract name: string
  client = client

  getTable() {
    return this.client.from<Model>(this.name)
  }

  async getAll(): Promise<Model[]> {
    const { data, error } = await this.getTable().select('*')
    if (error) Logger.error(error)

    return data ?? []
  }

  async getAllById(ids: Model[keyof Model][]): Promise<Model[]> {
    const { data, error } = await this.getTable().select('*').in('id', ids)
    if (error) Logger.error(error)

    return data ?? []
  }

  async getById(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.getTable()
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) Logger.error(error)

    return data
  }

  async insert(domain: Model | Model[]): Promise<Model | Model[] | null> {
    const { data, error } = await this.getTable().insert(domain)

    if (error) Logger.error(error)
    return data
  }

  async update(id: Model[keyof Model], model: Model): Promise<Model | null> {
    const { data, error } = await this.getTable()
      .update(model)
      .eq('id', id)
      .single()
    if (error) Logger.error(error)

    return data
  }

  async delete(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.getTable().delete().eq('id', id).single()
    if (error) Logger.error(error)

    return data
  }

  async exists(id: Model[keyof Model]): Promise<boolean> {
    const { data, error } = await this.getTable()
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) Logger.error(error)

    return !!data
  }
}
