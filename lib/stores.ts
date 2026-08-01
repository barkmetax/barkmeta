export interface RetailPartner {
  name: string;
  url: string;
  initials: string;
}

export const RETAIL_PARTNERS: RetailPartner[] = [
  { name: 'Alpha Deck Games', url: '#', initials: 'AD' },
  { name: 'Moon Kennel Cards', url: '#', initials: 'MK' },
  { name: 'Good Boy Games', url: '#', initials: 'GB' },
  { name: 'Treat Box TCG', url: '#', initials: 'TB' },
  { name: 'Wow Such Cards', url: '#', initials: 'WS' },
];

export interface StoreLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  events: string[];
  barkArena: boolean;
}

export const STORE_LOCATIONS: StoreLocation[] = [
  { id: 1, name: 'Alpha Deck Games', city: 'Los Angeles', state: 'CA', zip: '90012', address: '412 Kibble Ave', events: ['Bark Arena Fridays', 'Learn to Play Sundays'], barkArena: true },
  { id: 2, name: 'Moon Kennel Cards', city: 'Seattle', state: 'WA', zip: '98101', address: '88 Howl St', events: ['Bark Arena Thursdays'], barkArena: true },
  { id: 3, name: 'Good Boy Games', city: 'Austin', state: 'TX', zip: '78701', address: '1500 Fetch Blvd', events: ['Legends Draft Saturdays'], barkArena: true },
  { id: 4, name: 'Treat Box TCG', city: 'Brooklyn', state: 'NY', zip: '11201', address: '77 Biscuit Ln', events: ['Bark Arena Wednesdays', 'Sealed Sundays'], barkArena: true },
  { id: 5, name: 'Wow Such Cards', city: 'Denver', state: 'CO', zip: '80202', address: '900 Zoomie Way', events: ['Casual Play Tuesdays'], barkArena: false },
  { id: 6, name: 'The Dog House', city: 'Chicago', state: 'IL', zip: '60601', address: '245 Bone Ct', events: ['Bark Arena Fridays'], barkArena: true },
  { id: 7, name: 'Kennel & Deck', city: 'Portland', state: 'OR', zip: '97201', address: '61 Floof Dr', events: ['Learn to Play Saturdays'], barkArena: false },
  { id: 8, name: 'Snack Stack Games', city: 'Miami', state: 'FL', zip: '33101', address: '333 Puddle Rd', events: ['Bark Arena Mondays'], barkArena: true },
  { id: 9, name: 'Full Moon Hobbies', city: 'Phoenix', state: 'AZ', zip: '85001', address: '12 Howler Pass', events: ['Sealed Fridays'], barkArena: false },
  { id: 10, name: 'Paws & Play', city: 'Boston', state: 'MA', zip: '02108', address: '540 Sentinel St', events: ['Bark Arena Thursdays', 'Draft Saturdays'], barkArena: true },
  { id: 11, name: 'The Treat Vault', city: 'Nashville', state: 'TN', zip: '37201', address: '218 Baron Blvd', events: ['Casual Play Wednesdays'], barkArena: false },
  { id: 12, name: 'Storm Tails Gaming', city: 'Minneapolis', state: 'MN', zip: '55401', address: '75 Thunder Shed Rd', events: ['Bark Arena Saturdays'], barkArena: true },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  tag: string;
  palette: [string, string];
}

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Legends of the Pack Field Cloth — Moon Pack', price: 90, tag: 'FIELD CLOTH', palette: ['#4d5fb8', '#1a1409'] },
  { id: 'p2', name: 'Legends of the Pack Field Cloth — Shibe Order', price: 90, tag: 'FIELD CLOTH', palette: ['#e9a93d', '#b97a14'] },
  { id: 'p3', name: 'Alpha Doge Premium Field Cloth', price: 100, tag: 'FIELD CLOTH', palette: ['#cf3f2b', '#1a1409'] },
  { id: 'p4', name: 'Volume 01 Collector Binder', price: 45, tag: 'ACCESSORY', palette: ['#2e8c85', '#1a1409'] },
];
