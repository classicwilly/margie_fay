export interface MemorialEntry {
  id: string;
  name: string;
  birthDate?: string; // ISO date
  deathDate?: string; // ISO date
  excerpt?: string;
  photo?: string;
}

export const initialMemorials: MemorialEntry[] = [
  {
    id: 'margie-fay-katen',
    name: 'Margie Fay Katen',
    birthDate: '1925-07-19',
    deathDate: '2025-07-19',
    excerpt: 'Margie was a WWII riveter, homemaker, bowler, and matriarch. Practical, loving, and firm.',
    photo: '/grandma.svg',
  },
  {
    id: 'robert-james-katen',
    name: 'Robert James Katen',
    birthDate: '1920-06-09',
    deathDate: '2009-10-30',
    excerpt: 'Robert faithfully served his country, founded American Legion Baseball in Pryor, and loved his family.',
    photo: '/grandpa.png',
  },
];

export default initialMemorials;
