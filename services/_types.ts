
interface Image {
  URI: string,
  Width: number,
  Height: number
}

interface Price {
  MSRP: string,
  SalesPrice: string,
  IsFree: boolean
} 

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
  description: string
}

export interface XboxGame {
  ProductTitle: string,
  DeveloperName: string,
  ImageHero: Image,
  Price: Price,
  ApproximateSizeInBytes: number,
  ProductDescription: string,
  StoreId: string
}