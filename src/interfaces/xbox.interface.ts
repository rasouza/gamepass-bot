interface Image {
  URI: string
  Width: number
  Height: number
}

interface Price {
  MSRP: string
  SalesPrice: string
  IsFree: boolean
}

export interface XboxGame {
  StoreId: string
  ProductTitle: string
  DeveloperName: string
  ImageHero: Image
  Price: Price
  ApproximateSizeInBytes: number
  ProductDescription: string
}
