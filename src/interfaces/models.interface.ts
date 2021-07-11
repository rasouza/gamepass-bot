export interface SubscriptionModel {
  id: string,
  guild: string,
  channel: string,
}

export interface GameModel {
  id: string,
  title: string,
  developer: string,
  image: string | null,
  price: number | null,
  size: number | null,
  description: string,
  last_sync?: Date
}