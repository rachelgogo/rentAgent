export interface UserRequirements {
  location: string
  budget: {
    min: number
    max: number
  }
  bedrooms: number
  bathrooms: number
  area: {
    min: number
    max: number
  }
  amenities: string[]
  commuteTime: number
  petFriendly: boolean
  furnished: boolean
  parking: boolean
  description: string
}

export interface Apartment {
  id: string
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  amenities: string[]
  rating: number
  distance: number
  commuteTime: number
  petFriendly: boolean
  furnished: boolean
  parking: boolean
  contact: {
    phone: string
    email: string
  }
  availableDate: string
  highlights: string[]
  promotions?: string
  userReviews?: {
    pros: string[]
    cons: string[]
  }
  website?: string
}
