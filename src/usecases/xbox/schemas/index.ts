export default {
  StoreId: 'id',
  ProductTitle: 'title',
  DeveloperName: 'developer',
  'ImageHero.URI': 'image',
  'Price.MSRP': {
    key: 'price',
    transform: (value: string) =>
      Math.round(Number(value?.slice(1)) * 100) || null
  },
  ApproximateSizeInBytes: 'size',
  ProductDescription: 'description'
}
