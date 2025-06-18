import { WooCommerceSite } from '~/types/product';

// Configuration des sites - à terme, cela pourrait venir d'un fichier de config ou d'une interface admin
export const SITES_CONFIG: WooCommerceSite[] = [
  // Décommentez et configurez vos sites réels :
  /*
  {
    id: '1',
    name: 'Site Nautique Principal',
    url: 'https://myboattripriviera.com',
    consumerKey: 'ck_...',
    consumerSecret: 'cs_...',
    active: true,
  },
  {
    id: '2',
    name: 'Site Nautique Secondaire',
    url: 'https://autre-site.com',
    consumerKey: 'ck_...',
    consumerSecret: 'cs_...',
    active: true,
  }
  */
];

export function getSites(): WooCommerceSite[] {
  return SITES_CONFIG.filter(site => site.active);
}

export function getSiteById(id: string): WooCommerceSite | undefined {
  return SITES_CONFIG.find(site => site.id === id);
}

export function addSite(site: Omit<WooCommerceSite, 'id'>): WooCommerceSite {
  const newSite: WooCommerceSite = {
    ...site,
    id: Date.now().toString(),
  };
  
  SITES_CONFIG.push(newSite);
  return newSite;
}

export function updateSite(id: string, updates: Partial<WooCommerceSite>): WooCommerceSite | null {
  const index = SITES_CONFIG.findIndex(site => site.id === id);
  if (index === -1) return null;
  
  SITES_CONFIG[index] = { ...SITES_CONFIG[index], ...updates };
  return SITES_CONFIG[index];
}

export function removeSite(id: string): boolean {
  const index = SITES_CONFIG.findIndex(site => site.id === id);
  if (index === -1) return false;
  
  SITES_CONFIG.splice(index, 1);
  return true;
}