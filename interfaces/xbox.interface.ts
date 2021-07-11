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

export interface XboxGame {
  ProductTitle: string,
  DeveloperName: string,
  ImageHero: Image,
  Price: Price,
  ApproximateSizeInBytes: number,
  ProductDescription: string,
  StoreId: string
}