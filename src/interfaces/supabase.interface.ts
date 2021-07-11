export interface Subscription {
  channel: string;
  webhook: string;
}

export interface Game {
  id: string,
  title: string,
  developer: string,
  image: string | null,
  price: number | null,
  size: number | null,
  description: string,
  last_sync?: Date
}