import { SupabaseClient } from '@supabase/supabase-js'
import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { Logger } from 'winston'

interface PK {
  id: string | number
}

@provide(DB)
export abstract class DB<Model extends PK> {
  abstract name: string

  @inject(SupabaseClient)
  protected client!: SupabaseClient

  @inject('Logger')
  protected logger!: Logger

  getTable() {
    return this.client.from<Model>(this.name)
  }

  async pluck(field: keyof Model): Promise<Model[keyof Model][]> {
    const { data, error } = await this.getTable().select(field as string)
    if (error) this.logger.error(error)

    if (!data) return []
    const response = data.map((item: Model) => item[field])
    return response
  }

  async getAll(): Promise<Model[]> {
    const { data, error } = await this.getTable().select('*')
    if (error) this.logger.error(error)

    return data ?? []
  }

  async getAllById(ids: Model[keyof Model][]): Promise<Model[]> {
    const { data, error } = await this.getTable().select('*').in('id', ids)
    if (error) this.logger.error(error)

    return data ?? []
  }

  async getById(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.getTable()
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) this.logger.error(error)

    return data
  }

  async insert(domain: Model | Model[]): Promise<Model | Model[] | null> {
    const { data, error } = await this.getTable().insert(domain)

    if (error) this.logger.error(error)
    return data
  }

  async update(id: Model[keyof Model], model: Model): Promise<Model | null> {
    const { data, error } = await this.getTable()
      .update(model)
      .eq('id', id)
      .single()
    if (error) this.logger.error(error)

    return data
  }

  async delete(id: Model[keyof Model]): Promise<Model | null> {
    const { data, error } = await this.getTable().delete().eq('id', id).single()
    if (error) this.logger.error(error)

    return data
  }

  async exists(id: Model[keyof Model]): Promise<boolean> {
    const { data, error } = await this.getTable()
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) this.logger.error(error)

    return !!data
  }

  subscribe(fn: (item: Model) => void) {
    this.getTable().on('INSERT', (payload) => fn(payload.new))
  }
}
