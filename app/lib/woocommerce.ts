import { WooCommerceSite, Product } from '~/types/product';

export class WooCommerceAPI {
  private site: WooCommerceSite;

  constructor(site: WooCommerceSite) {
    this.site = site;
  }

  private getAuthHeader() {
    const credentials = btoa(`${this.site.consumerKey}:${this.site.consumerSecret}`);
    return `Basic ${credentials}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.site.url}/wp-json/wc/v3/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(params: Record<string, any> = {}): Promise<Product[]> {
    const queryParams = new URLSearchParams({
      per_page: '100',
      ...params,
    });

    const products = await this.makeRequest(`products?${queryParams}`);
    
    return products.map((product: any) => this.transformProduct(product));
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.makeRequest(`products/${id}`);
    return this.transformProduct(product);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const wooData = this.transformToWooCommerce(productData);
    const product = await this.makeRequest('products', {
      method: 'POST',
      body: JSON.stringify(wooData),
    });
    
    return this.transformProduct(product);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const wooData = this.transformToWooCommerce(productData);
    const product = await this.makeRequest(`products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(wooData),
    });
    
    return this.transformProduct(product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.makeRequest(`products/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<any[]> {
    return this.makeRequest('products/categories?per_page=100');
  }

  async getAttributes(): Promise<any[]> {
    return this.makeRequest('products/attributes');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('products?per_page=1');
      return true;
    } catch (error) {
      return false;
    }
  }

  private transformProduct(wooProduct: any): Product {
    return {
      id: wooProduct.id.toString(),
      name: wooProduct.name,
      description: wooProduct.description,
      shortDescription: wooProduct.short_description,
      sku: wooProduct.sku || '',
      price: parseFloat(wooProduct.price) || 0,
      salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : undefined,
      regularPrice: parseFloat(wooProduct.regular_price) || 0,
      manageStock: wooProduct.manage_stock,
      stockQuantity: wooProduct.stock_quantity,
      stockStatus: wooProduct.stock_status as 'instock' | 'outofstock' | 'onbackorder',
      weight: wooProduct.weight ? parseFloat(wooProduct.weight) : undefined,
      dimensions: {
        length: wooProduct.dimensions?.length ? parseFloat(wooProduct.dimensions.length) : undefined,
        width: wooProduct.dimensions?.width ? parseFloat(wooProduct.dimensions.width) : undefined,
        height: wooProduct.dimensions?.height ? parseFloat(wooProduct.dimensions.height) : undefined,
      },
      categories: wooProduct.categories?.map((cat: any) => cat.name) || [],
      tags: wooProduct.tags?.map((tag: any) => tag.name) || [],
      images: wooProduct.images?.map((img: any) => img.src) || [],
      featuredImage: wooProduct.images?.[0]?.src,
      status: wooProduct.status as 'draft' | 'pending' | 'private' | 'publish',
      catalogVisibility: wooProduct.catalog_visibility as 'visible' | 'catalog' | 'search' | 'hidden',
      featured: wooProduct.featured,
      virtual: wooProduct.virtual,
      downloadable: wooProduct.downloadable,
      createdAt: wooProduct.date_created,
      updatedAt: wooProduct.date_modified,
      attributes: wooProduct.attributes || [],
      siteId: this.site.id,
      siteName: this.site.name,
    };
  }

  private transformToWooCommerce(product: Partial<Product>): any {
    const wooData: any = {};

    if (product.name) wooData.name = product.name;
    if (product.description) wooData.description = product.description;
    if (product.shortDescription) wooData.short_description = product.shortDescription;
    if (product.sku) wooData.sku = product.sku;
    if (product.regularPrice !== undefined) wooData.regular_price = product.regularPrice.toString();
    if (product.salePrice !== undefined) wooData.sale_price = product.salePrice.toString();
    if (product.manageStock !== undefined) wooData.manage_stock = product.manageStock;
    if (product.stockQuantity !== undefined) wooData.stock_quantity = product.stockQuantity;
    if (product.stockStatus) wooData.stock_status = product.stockStatus;
    if (product.weight !== undefined) wooData.weight = product.weight.toString();
    
    if (product.dimensions) {
      wooData.dimensions = {
        length: product.dimensions.length?.toString() || '',
        width: product.dimensions.width?.toString() || '',
        height: product.dimensions.height?.toString() || '',
      };
    }

    if (product.categories) {
      wooData.categories = product.categories.map(name => ({ name }));
    }

    if (product.tags) {
      wooData.tags = product.tags.map(name => ({ name }));
    }

    if (product.images) {
      wooData.images = product.images.map(src => ({ src }));
    }

    if (product.status) wooData.status = product.status;
    if (product.catalogVisibility) wooData.catalog_visibility = product.catalogVisibility;
    if (product.featured !== undefined) wooData.featured = product.featured;
    if (product.virtual !== undefined) wooData.virtual = product.virtual;
    if (product.downloadable !== undefined) wooData.downloadable = product.downloadable;

    return wooData;
  }
}

export class WooCommerceManager {
  private sites: WooCommerceSite[] = [];

  constructor(sites: WooCommerceSite[]) {
    this.sites = sites.filter(site => site.active);
  }

  async getAllProducts(): Promise<Product[]> {
    const allProducts: Product[] = [];
    
    for (const site of this.sites) {
      try {
        const api = new WooCommerceAPI(site);
        const products = await api.getProducts();
        allProducts.push(...products);
      } catch (error) {
        console.error(`Erreur lors de la récupération des produits de ${site.name}:`, error);
      }
    }

    return this.deduplicateProducts(allProducts);
  }

  async getProductById(id: string, siteId: string): Promise<Product | null> {
    const site = this.sites.find(s => s.id === siteId);
    if (!site) return null;

    try {
      const api = new WooCommerceAPI(site);
      return await api.getProduct(id);
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      return null;
    }
  }

  async createProduct(productData: Partial<Product>, selectedSiteIds: string[]): Promise<Product[]> {
    const createdProducts: Product[] = [];
    
    for (const siteId of selectedSiteIds) {
      const site = this.sites.find(s => s.id === siteId);
      if (!site) continue;

      try {
        const api = new WooCommerceAPI(site);
        const product = await api.createProduct(productData);
        createdProducts.push(product);
      } catch (error) {
        console.error(`Erreur lors de la création du produit sur ${site.name}:`, error);
      }
    }

    return createdProducts;
  }

  async updateProduct(id: string, siteId: string, productData: Partial<Product>): Promise<Product | null> {
    const site = this.sites.find(s => s.id === siteId);
    if (!site) return null;

    try {
      const api = new WooCommerceAPI(site);
      return await api.updateProduct(id, productData);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      return null;
    }
  }

  async deleteProduct(id: string, siteId: string): Promise<boolean> {
    const site = this.sites.find(s => s.id === siteId);
    if (!site) return false;

    try {
      const api = new WooCommerceAPI(site);
      await api.deleteProduct(id);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      return false;
    }
  }

  async deleteProductFromAllSites(sku: string): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const site of this.sites) {
      try {
        const api = new WooCommerceAPI(site);
        const products = await api.getProducts({ sku });
        
        for (const product of products) {
          await api.deleteProduct(product.id);
        }
        
        results.success.push(site.name);
      } catch (error) {
        console.error(`Erreur lors de la suppression sur ${site.name}:`, error);
        results.failed.push(site.name);
      }
    }

    return results;
  }

  async testSiteConnection(site: WooCommerceSite): Promise<boolean> {
    try {
      const api = new WooCommerceAPI(site);
      return await api.testConnection();
    } catch (error) {
      return false;
    }
  }

  private deduplicateProducts(products: Product[]): Product[] {
    const productMap = new Map<string, Product & { sites: string[] }>();

    for (const product of products) {
      const key = product.sku || product.name;
      
      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        existing.sites.push(product.siteName!);
      } else {
        productMap.set(key, {
          ...product,
          sites: [product.siteName!],
        });
      }
    }

    return Array.from(productMap.values());
  }
}