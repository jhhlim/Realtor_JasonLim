export type BuyPickStatus = "open_house" | "active" | "sold";

export interface BuyPick {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  unit?: string;
  price?: number;
  priceLabel?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  status: BuyPickStatus;
  badge?: string;
  blurb: string;
  listingAgent: string;
  listingAgentDre?: string;
  roleNote?: string;
  href: string;
  photo: string;
  openHouse?: string;
}

/** Active picks + current open houses Jason recommends / hosts. */
export const buyActivePicks: BuyPick[] = [
  {
    id: "postwood",
    address: "2974 Postwood Dr",
    city: "San Jose",
    state: "CA",
    zip: "95132",
    price: 1688000,
    beds: 6,
    baths: 4,
    status: "open_house",
    badge: "Open House Sat 2–4:30 PM",
    blurb:
      "Highly renovated 6-bed / 4-bath with dual kitchens downstairs and two backyard sheds — flexible for multi-gen living.",
    listingAgent: "Fan Yeh",
    listingAgentDre: "DRE #01948545",
    roleNote: "Open house hosted by Jason Lim",
    href: "https://www.compass.com/homedetails/2974-Postwood-Dr-San-Jose-CA-95132/1PYYE9_pid/",
    photo: "/images/buy-picks/2974-postwood.jpg",
    openHouse: "Sat Oct 31 · 2:00–4:30 PM",
  },
  {
    id: "rengstorff",
    address: "255 S Rengstorff Ave",
    city: "Mountain View",
    state: "CA",
    zip: "94040",
    unit: "42",
    price: 650000,
    beds: 2,
    baths: 1,
    sqft: 935,
    status: "open_house",
    badge: "Open House Sun 1:30–4 PM",
    blurb:
      "Bright condo with private patio, pool/tennis/pickleball amenities, near Castro Street, Farmers Market, Google, and Rengstorff Park.",
    listingAgent: "Marcie Soderquist",
    listingAgentDre: "DRE #01193911",
    roleNote: "Open house hosted by Jason Lim",
    href: "https://www.compass.com/homedetails/255-S-Rengstorff-Ave-Unit-42-Mountain-View-CA-94040/1Q53K1_pid/",
    photo: "/images/buy-picks/255-rengstorff.jpg",
    openHouse: "Sun Nov 1 · 1:30–4:00 PM",
  },
  {
    id: "anne-marie",
    address: "1868 Anne Marie Ct",
    city: "San Jose",
    state: "CA",
    zip: "95132",
    beds: 3,
    baths: 2,
    sqft: 1320,
    status: "active",
    badge: "Featured · Berryessa",
    priceLabel: "Recently reduced $200K",
    blurb:
      "Inviting single-story on a quiet Berryessa court — refreshed interiors, functional layout, and a spacious backyard deck.",
    listingAgent: "Patrice Carper",
    roleNote: "Open houses previously hosted by Jason Lim",
    href: "https://www.compass.com/app/listing/1868-Anne-Marie-Ct-San-Jose-CA-95132/2027130113140043185",
    photo: "/images/buy-picks/1868-anne-marie.jpg",
  },
  {
    id: "monroe",
    address: "2831 Monroe St",
    city: "Santa Clara",
    state: "CA",
    zip: "95051",
    status: "active",
    badge: "Featured Santa Clara",
    priceLabel: "Recently reduced $100K · Oct 28",
    blurb:
      "Featured Santa Clara remodel with curb appeal — price reduced $100K on Oct 28. Strong location for buyers who want Silicon Valley access with a practical commute footprint.",
    listingAgent: "Hillary Aung Yin",
    roleNote: "Recommended active listing",
    href: "https://www.compass.com/homedetails/2831-Monroe-St-Santa-Clara-CA-95051/1QTRAZ_pid/",
    photo: "/images/buy-picks/2831-monroe.jpg",
  },
];

/** Past open houses Jason hosted — homes that have since sold. */
export const buyPastOpenHouses: BuyPick[] = [
  {
    id: "rockton",
    address: "6887 Rockton Ave",
    city: "San Jose",
    state: "CA",
    zip: "95119",
    status: "sold",
    badge: "Open house held · Sold",
    blurb:
      "Jason hosted the open house for this South San Jose listing with Negar Fatemi — the home has since sold.",
    listingAgent: "Negar Fatemi",
    roleNote: "Open house hosted by Jason Lim",
    href: "https://www.compass.com/app/listing/6887-Rockton-Ave-San-Jose-CA-95119/2136556258138323961",
    photo: "/images/buy-picks/6887-rockton.jpg",
  },
  {
    id: "younger",
    address: "19 E Younger Ave",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    status: "sold",
    badge: "Open house held · Sold",
    blurb:
      "Jason hosted the open house for this San Jose listing with Negar Fatemi — the home has since sold.",
    listingAgent: "Negar Fatemi",
    roleNote: "Open house hosted by Jason Lim",
    href: "https://www.compass.com/homedetails/19-E-Younger-Ave-San-Jose-CA-95112/1PUNIM_pid/",
    photo: "/images/buy-picks/19-younger.jpg",
  },
  {
    id: "casselino",
    address: "425 Casselino Dr",
    city: "San Jose",
    state: "CA",
    zip: "95136",
    status: "sold",
    badge: "Open house held · Sold",
    blurb:
      "Jason hosted the open house for Hillary Aung Yin’s listing — the home has since sold.",
    listingAgent: "Hillary Aung Yin",
    roleNote: "Open house hosted by Jason Lim",
    href: "https://www.compass.com/app/listing/425-Casselino-Dr-San-Jose-CA-95136/2100335772068890313",
    photo: "/images/buy-picks/425-casselino.jpg",
  },
];
