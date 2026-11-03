import type { StudioCategory } from "./types"

export const STUDIO_CATEGORIES: StudioCategory[] = [
  {
    slug: "photo-studios",
    name: "Photo Studios",
    shortName: "Photo",
    description:
      "Cyc walls, natural-light lofts, and fully rigged photography bays.",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1400&q=80",
    accent: "#e8a33d",
  },
  {
    slug: "sound-stages",
    name: "Sound Stages",
    shortName: "Stage",
    description:
      "Acoustically treated stages built for film, commercials, and motion.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80",
    accent: "#c96f4a",
  },
  {
    slug: "podcast-rooms",
    name: "Podcast Rooms",
    shortName: "Podcast",
    description:
      "Broadcast-ready rooms with mics, mixers, and camera-ready lighting.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1400&q=80",
    accent: "#8a9a5b",
  },
  {
    slug: "music-suites",
    name: "Music Suites",
    shortName: "Music",
    description:
      "Writing rooms, live rooms, and control suites for every session.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80",
    accent: "#7d7ab8",
  },
  {
    slug: "art-workshops",
    name: "Art Workshops",
    shortName: "Workshop",
    description:
      "Open, light-filled studios for painting, ceramics, and making things.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80",
    accent: "#b86f8a",
  },
]

export const CATEGORY_BY_SLUG = Object.fromEntries(
  STUDIO_CATEGORIES.map((category) => [category.slug, category])
) as Record<StudioCategory["slug"], StudioCategory>

export const CITIES = [
  "Los Angeles",
  "New York",
  "Austin",
  "Chicago",
  "Atlanta",
  "Portland",
  "Miami",
  "Seattle",
] as const

export const AMENITIES = [
  "Cyc wall",
  "Blackout curtains",
  "Natural light",
  "Loading dock",
  "Freight elevator",
  "Green room",
  "Hair & makeup station",
  "Wi-Fi",
  "Air conditioning",
  "Heating",
  "Parking",
  "Wheelchair accessible",
  "Professional lighting",
  "Camera packages",
  "Soundproofing",
  "Recording booth",
  "Mixing console",
  "Microphones",
  "Live room",
  "Grand piano",
  "Drum kit",
  "Projector",
  "Whiteboard",
  "Sink & wash station",
  "Kiln",
  "Easels",
  "Coffee & tea",
  "Kitchenette",
  "Shower",
  "Security system",
] as const

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const

export const OPEN_HOUR = 8
export const CLOSE_HOUR = 20
export const SERVICE_FEE_RATE = 0.07
export const BOOKING_HORIZON_DAYS = 90
export const MAX_BOOKING_HOURS = 8

export const STUDIO_SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
] as const

export const MAX_PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "60", label: "Up to $60 / hr" },
  { value: "100", label: "Up to $100 / hr" },
  { value: "150", label: "Up to $150 / hr" },
  { value: "250", label: "Up to $250 / hr" },
] as const

export const DEMO_CREDENTIALS = {
  email: "demo@studiospace.com",
  password: "studio123",
}
