export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  salePrice?: number;
  regularPrice: number;
  manageStock: boolean;
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  weight?: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  categories: string[];
  tags: string[];
  images: string[];
  featuredImage?: string;
  status: 'draft' | 'pending' | 'private' | 'publish';
  catalogVisibility: 'visible' | 'catalog' | 'search' | 'hidden';
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  createdAt: string;
  updatedAt: string;
  attributes?: ProductAttribute[];
  siteId?: string;
  siteName?: string;
  sites?: string[];
  // Nouveaux champs basés sur l'exemple CSV
  menuOrder?: number;
  totalSales?: number;
  globalUniqueId?: string;
  productUrl?: string;
  buttonText?: string;
  downloadableFiles?: string;
  taxClass?: string;
  taxStatus?: string;
  backorders?: string;
  soldIndividually?: boolean;
  lowStockAmount?: number;
  purchaseNote?: string;
  salePriceDatesFrom?: string;
  salePriceDatesTo?: string;
  downloadLimit?: number;
  downloadExpiry?: number;
  upsellIds?: string[];
  crosssellIds?: string[];
}

export interface ProductAttribute {
  id?: number;
  name: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options: string[];
  slug?: string;
}

export interface WooCommerceSite {
  id: string;
  name: string;
  url: string;
  consumerKey: string;
  consumerSecret: string;
  active: boolean;
  lastSync?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  regularPrice: number;
  salePrice?: number;
  manageStock: boolean;
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  weight?: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  categories: string[];
  tags: string[];
  images: string[];
  status: 'draft' | 'pending' | 'private' | 'publish';
  catalogVisibility: 'visible' | 'catalog' | 'search' | 'hidden';
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  selectedSites: string[];
  attributes?: ProductAttribute[];
  // Nouveaux champs
  menuOrder?: number;
  taxClass?: string;
  taxStatus?: string;
  backorders?: string;
  soldIndividually?: boolean;
  lowStockAmount?: number;
  purchaseNote?: string;
  productUrl?: string;
  buttonText?: string;
}

export interface SiteStats {
  totalSites: number;
  connectedSites: number;
  errorSites: number;
  totalProducts: number;
}