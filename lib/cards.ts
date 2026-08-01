export type Faction = 'Moon Pack' | 'Bone Legion' | 'Shibe Order' | 'Storm Tails';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
export type CardType = 'Alpha' | 'Gate' | 'Pack' | 'Tactic';

export interface DogPalette {
  fur: string;
  furLight: string;
  accent: string;
  bg: string;
}

export interface DogCard {
  id: string;
  name: string;
  faction: Faction;
  rarity: Rarity;
  type: CardType;
  cost: number;
  power: number | null;
  artist: string;
  flavor: string;
  variant: 'base' | 'bandana' | 'cap' | 'laser';
  palette: DogPalette;
}

export const FACTIONS: Record<Faction, { color: string; blurb: string }> = {
  'Moon Pack': {
    color: '#4d5fb8',
    blurb: 'Mystics who howl at the moon and bend fortune to the pack.',
  },
  'Bone Legion': {
    color: '#c2452f',
    blurb: 'Battle-scarred veterans who never bury a grudge — only bones.',
  },
  'Shibe Order': {
    color: '#b97a14',
    blurb: 'Disciplined guardians of the ancient ways of wow.',
  },
  'Storm Tails': {
    color: '#2e8c85',
    blurb: 'Zoomies-powered raiders who strike faster than thunder.',
  },
};

export const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Legendary'];
export const CARD_TYPES: CardType[] = ['Alpha', 'Gate', 'Pack', 'Tactic'];

const P = {
  shiba: { fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: '#f1d7a0' },
  husky: { fur: '#8a93a6', furLight: '#e9edf2', accent: '#4d5fb8', bg: '#cfd8e8' },
  night: { fur: '#3a3548', furLight: '#8f87a8', accent: '#e9a93d', bg: '#6a628a' },
  choco: { fur: '#7a4a26', furLight: '#d9b38a', accent: '#2e8c85', bg: '#c9a578' },
  cream: { fur: '#dcc39a', furLight: '#f7efe0', accent: '#c2452f', bg: '#efe0c2' },
  storm: { fur: '#4e7d78', furLight: '#bfe0dc', accent: '#e9a93d', bg: '#a5cfca' },
  ember: { fur: '#b0492f', furLight: '#eebd9a', accent: '#e9a93d', bg: '#e3a284' },
  frost: { fur: '#b8c4d8', furLight: '#f2f6fb', accent: '#2e8c85', bg: '#dbe4f0' },
} satisfies Record<string, DogPalette>;

export const CARDS: DogCard[] = [
  { id: 'ddl-001', name: 'Alpha Doge', faction: 'Shibe Order', rarity: 'Legendary', type: 'Alpha', cost: 0, power: 8, artist: 'pixelpaws', flavor: 'Much leader. Very destiny. Wow.', variant: 'laser', palette: P.shiba },
  { id: 'ddl-002', name: 'Luna the Howler', faction: 'Moon Pack', rarity: 'Legendary', type: 'Alpha', cost: 0, power: 7, artist: 'moonbark.eth', flavor: 'When she sings, the tide of battle turns.', variant: 'base', palette: P.night },
  { id: 'ddl-003', name: 'Bones McGraw', faction: 'Bone Legion', rarity: 'Legendary', type: 'Alpha', cost: 0, power: 9, artist: 'kennelkid', flavor: 'He buried a thousand bones. He remembers every one.', variant: 'bandana', palette: P.choco },
  { id: 'ddl-004', name: 'Storm Warden Rex', faction: 'Storm Tails', rarity: 'Legendary', type: 'Alpha', cost: 0, power: 7, artist: 'zoomiezine', flavor: 'The zoomies chose him.', variant: 'cap', palette: P.storm },
  { id: 'ddl-005', name: 'Moongate of Howling', faction: 'Moon Pack', rarity: 'Rare', type: 'Gate', cost: 2, power: null, artist: 'moonbark.eth', flavor: 'Every howl opens a door.', variant: 'base', palette: P.frost },
  { id: 'ddl-006', name: 'The Great Kennel', faction: 'Shibe Order', rarity: 'Rare', type: 'Gate', cost: 2, power: null, artist: 'pixelpaws', flavor: 'All packs return home eventually.', variant: 'base', palette: P.cream },
  { id: 'ddl-007', name: 'Boneyard Rampart', faction: 'Bone Legion', rarity: 'Rare', type: 'Gate', cost: 3, power: null, artist: 'wenmint', flavor: 'Built from ten thousand victories.', variant: 'base', palette: P.ember },
  { id: 'ddl-008', name: 'Thundershed', faction: 'Storm Tails', rarity: 'Rare', type: 'Gate', cost: 2, power: null, artist: 'zoomiezine', flavor: 'Do not knock. It knocks back.', variant: 'base', palette: P.storm },
  { id: 'ddl-009', name: 'Kibble Knight', faction: 'Shibe Order', rarity: 'Uncommon', type: 'Pack', cost: 3, power: 4, artist: 'goodboygus', flavor: 'Sworn to protect the sacred snack.', variant: 'cap', palette: P.shiba },
  { id: 'ddl-010', name: 'Moonlit Scout Miso', faction: 'Moon Pack', rarity: 'Uncommon', type: 'Pack', cost: 2, power: 2, artist: 'moonbark.eth', flavor: 'Small paws. Silent steps.', variant: 'base', palette: P.husky },
  { id: 'ddl-011', name: 'Sgt. Biscuit', faction: 'Bone Legion', rarity: 'Uncommon', type: 'Pack', cost: 3, power: 3, artist: 'kennelkid', flavor: 'Crumbles for no one.', variant: 'bandana', palette: P.cream },
  { id: 'ddl-012', name: 'Nimbus the Swift', faction: 'Storm Tails', rarity: 'Uncommon', type: 'Pack', cost: 2, power: 3, artist: 'zoomiezine', flavor: 'Blink and you owe him a treat.', variant: 'base', palette: P.frost },
  { id: 'ddl-013', name: 'Treatkeeper Tato', faction: 'Shibe Order', rarity: 'Common', type: 'Pack', cost: 1, power: 1, artist: 'goodboygus', flavor: 'One treat in, one treat out. Balance.', variant: 'base', palette: P.shiba },
  { id: 'ddl-014', name: 'Howl Sentinel', faction: 'Moon Pack', rarity: 'Common', type: 'Pack', cost: 2, power: 2, artist: 'pixelpaws', flavor: 'First to hear. First to howl.', variant: 'base', palette: P.night },
  { id: 'ddl-015', name: 'Digger of Ruins', faction: 'Bone Legion', rarity: 'Common', type: 'Pack', cost: 2, power: 2, artist: 'wenmint', flavor: 'Every hole is a headline.', variant: 'base', palette: P.choco },
  { id: 'ddl-016', name: 'Puddle Jumper', faction: 'Storm Tails', rarity: 'Common', type: 'Pack', cost: 1, power: 1, artist: 'zoomiezine', flavor: 'Splash first, ask later.', variant: 'base', palette: P.storm },
  { id: 'ddl-017', name: 'Bork Adept', faction: 'Moon Pack', rarity: 'Common', type: 'Pack', cost: 1, power: 1, artist: 'moonbark.eth', flavor: 'Studied borkology under the full moon.', variant: 'base', palette: P.husky },
  { id: 'ddl-018', name: 'Snack Baron', faction: 'Bone Legion', rarity: 'Rare', type: 'Pack', cost: 4, power: 5, artist: 'kennelkid', flavor: 'Controls the treat economy with an iron paw.', variant: 'cap', palette: P.ember },
  { id: 'ddl-019', name: 'Grand Floof', faction: 'Shibe Order', rarity: 'Rare', type: 'Pack', cost: 5, power: 6, artist: 'pixelpaws', flavor: 'Beneath the floof lies unstoppable force.', variant: 'base', palette: P.cream },
  { id: 'ddl-020', name: 'Night Watcher Umbra', faction: 'Moon Pack', rarity: 'Rare', type: 'Pack', cost: 4, power: 4, artist: 'wenmint', flavor: 'The dark is just a bigger blanket.', variant: 'base', palette: P.night },
  { id: 'ddl-021', name: 'Zoomies!', faction: 'Storm Tails', rarity: 'Common', type: 'Tactic', cost: 1, power: null, artist: 'zoomiezine', flavor: 'Give a Pack dog +2 speed until end of turn.', variant: 'base', palette: P.storm },
  { id: 'ddl-022', name: 'Fetch the Legend', faction: 'Shibe Order', rarity: 'Uncommon', type: 'Tactic', cost: 2, power: null, artist: 'goodboygus', flavor: 'Search your deck for a Legend. Good dog.', variant: 'base', palette: P.shiba },
  { id: 'ddl-023', name: 'Midnight Chorus', faction: 'Moon Pack', rarity: 'Rare', type: 'Tactic', cost: 3, power: null, artist: 'moonbark.eth', flavor: 'All Moon Pack dogs howl. Draw two cards.', variant: 'base', palette: P.frost },
  { id: 'ddl-024', name: 'Bury the Evidence', faction: 'Bone Legion', rarity: 'Uncommon', type: 'Tactic', cost: 2, power: null, artist: 'kennelkid', flavor: 'Remove a Tactic from the game. No witnesses.', variant: 'base', palette: P.ember },
];

export function getCard(id: string): DogCard | undefined {
  return CARDS.find((c) => c.id === id);
}
