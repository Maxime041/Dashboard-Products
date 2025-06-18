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
}