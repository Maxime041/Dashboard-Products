import { WooCommerceSite, Product, ProductAttribute } from '~/types/product';

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
    
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WooCommerce API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  }

  async getProducts(params: Record<string, any> = {}): Promise<Product[]> {
    const queryParams = new URLSearchParams({
      per_page: '100',
      ...params,
    });

    try {
      const products = await this.makeRequest(`products?${queryParams}`);
      return products.map((product: any) => this.transformProduct(product));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const product = await this.makeRequest(`products/${id}`);
      return this.transformProduct(product);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const wooData = this.transformToWooCommerce(productData);
      console.log('Creating product with data:', wooData);
      
      const product = await this.makeRequest('products', {
        method: 'POST',
        body: JSON.stringify(wooData),
      });
      
      return this.transformProduct(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const wooData = this.transformToWooCommerce(productData);
      console.log(`Updating product ${id} with data:`, wooData);
      
      const product = await this.makeRequest(`products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(wooData),
      });
      
      return this.transformProduct(product);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log(`Deleting product ${id}`);
      await this.makeRequest(`products/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ force: true }), // Force delete permanently
      });
      console.log(`Product ${id} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      return await this.makeRequest('products/categories?per_page=100');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getAttributes(): Promise<any[]> {
    try {
      return await this.makeRequest('products/attributes');
    } catch (error) {
      console.error('Error fetching attributes:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('products?per_page=1');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
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
      // Nouveaux champs
      menuOrder: wooProduct.menu_order,
      totalSales: wooProduct.total_sales,
      globalUniqueId: wooProduct.meta_data?.find((meta: any) => meta.key === '_global_unique_id')?.value,
      taxClass: wooProduct.tax_class,
      taxStatus: wooProduct.tax_status,
      backorders: wooProduct.backorders,
      soldIndividually: wooProduct.sold_individually,
      lowStockAmount: wooProduct.low_stock_amount,
      purchaseNote: wooProduct.purchase_note,
      productUrl: wooProduct.external_url,
      buttonText: wooProduct.button_text,
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

    // Gestion des catégories - créer si elles n'existent pas
    if (product.categories && product.categories.length > 0) {
      wooData.categories = product.categories.map(name => ({ name }));
    }

    // Gestion des tags - créer si ils n'existent pas
    if (product.tags && product.tags.length > 0) {
      wooData.tags = product.tags.map(name => ({ name }));
    }

    // Gestion des images
    if (product.images && product.images.length > 0) {
      wooData.images = product.images.map((src, index) => ({ 
        src, 
        position: index,
        alt: product.name || ''
      }));
    }

    if (product.status) wooData.status = product.status;
    if (product.catalogVisibility) wooData.catalog_visibility = product.catalogVisibility;
    if (product.featured !== undefined) wooData.featured = product.featured;
    if (product.virtual !== undefined) wooData.virtual = product.virtual;
    if (product.downloadable !== undefined) wooData.downloadable = product.downloadable;

    // Nouveaux champs
    if (product.menuOrder !== undefined) wooData.menu_order = product.menuOrder;
    if (product.taxClass) wooData.tax_class = product.taxClass;
    if (product.taxStatus) wooData.tax_status = product.taxStatus;
    if (product.backorders) wooData.backorders = product.backorders;
    if (product.soldIndividually !== undefined) wooData.sold_individually = product.soldIndividually;
    if (product.lowStockAmount !== undefined) wooData.low_stock_amount = product.lowStockAmount;
    if (product.purchaseNote) wooData.purchase_note = product.purchaseNote;
    if (product.productUrl) wooData.external_url = product.productUrl;
    if (product.buttonText) wooData.button_text = product.buttonText;

    // Attributs personnalisés basés sur l'exemple CSV
    if (product.attributes && product.attributes.length > 0) {
      wooData.attributes = product.attributes.map((attr: ProductAttribute) => ({
        name: attr.name,
        position: attr.position || 0,
        visible: attr.visible !== false,
        variation: attr.variation || false,
        options: attr.options,
      }));
    }

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
    const errors: string[] = [];
    
    for (const siteId of selectedSiteIds) {
      const site = this.sites.find(s => s.id === siteId);
      if (!site) {
        errors.push(`Site ${siteId} non trouvé`);
        continue;
      }

      try {
        const api = new WooCommerceAPI(site);
        const product = await api.createProduct(productData);
        createdProducts.push(product);
        console.log(`Produit créé avec succès sur ${site.name}`);
      } catch (error) {
        const errorMessage = `Erreur lors de la création du produit sur ${site.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
        console.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    if (errors.length > 0 && createdProducts.length === 0) {
      throw new Error(`Erreurs lors de la création: ${errors.join(', ')}`);
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
      throw error;
    }
  }

  async deleteProduct(id: string, siteId: string): Promise<boolean> {
    const site = this.sites.find(s => s.id === siteId);
    if (!site) return false;

    try {
      const api = new WooCommerceAPI(site);
      return await api.deleteProduct(id);
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  }

  async deleteProductFromAllSites(sku: string): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const site of this.sites) {
      try {
        const api = new WooCommerceAPI(site);
        const products = await api.getProducts({ sku });
        
        let deletedCount = 0;
        for (const product of products) {
          const deleted = await api.deleteProduct(product.id);
          if (deleted) deletedCount++;
        }
        
        if (deletedCount > 0) {
          results.success.push(`${site.name} (${deletedCount} produit(s))`);
        } else {
          results.failed.push(`${site.name} (aucun produit trouvé)`);
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression sur ${site.name}:`, error);
        results.failed.push(`${site.name} (${error instanceof Error ? error.message : 'erreur inconnue'})`);
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
      const key = product.sku || `${product.name}-${product.siteId}`;
      
      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        if (!existing.sites.includes(product.siteName!)) {
          existing.sites.push(product.siteName!);
        }
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