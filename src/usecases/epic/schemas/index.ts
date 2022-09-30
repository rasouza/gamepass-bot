import { isEmpty } from 'lodash/fp'

const isDeveloper = (item: any) => item.key === 'developerName'
const isThumbnail = (item: any) => item.type === 'Thumbnail'

export default {
  title: 'title',
  id: 'id',
  description: 'description',
  'price.totalPrice.originalPrice': 'price',
  'promotions.promotionalOffers[0].promotionalOffers[0].startDate':
    'offer.startDate',
  'promotions.promotionalOffers[0].promotionalOffers[0].endDate':
    'offer.endDate',
  'promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate':
    'offer.startDate',
  'promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate':
    'offer.endDate',
  promotions: {
    key: 'offer.upcoming',
    transform: (value: any) => {
      const { promotionalOffers, upcomingPromotionalOffers } = value || {}
      if (isEmpty(promotionalOffers) && isEmpty(upcomingPromotionalOffers))
        return
      return upcomingPromotionalOffers.length > 0
    }
  },
  'customAttributes[]': {
    key: 'developer',
    transform: function (value: any) {
      if (value instanceof Array) {
        const developer = value.filter(isDeveloper)
        if (developer.length > 0) {
          return developer[0].value
        }
      }
    }
  },
  'keyImages[]': {
    key: 'image',
    transform: (value: any) => {
      if (isEmpty(value)) return
      const image = value.filter(isThumbnail)[0]?.url

      return image
    }
  }
}
