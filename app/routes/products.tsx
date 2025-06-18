import type { Route } from "./+types/products";
import { Layout } from "~/components/Layout";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { Package, Edit, Trash2, Eye, Globe, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { WooCommerceManager } from "~/lib/woocommerce";
import { getSites } from "~/lib/sites";
import { Product } from "~/types/product";
import { useState, useEffect } from "react";

export async function loader(): Promise<{ products: Product[] }> {
  const sites = getSites();
  const manager = new WooCommerceManager(sites);
  
  try {
    const products = await manager.getAllProducts();
    return { products };
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    return { products: [] };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Produits - WooCommerce Manager" },
    { name: "description", content: "Gérez tous vos produits WooCommerce" },
  ];
}

export default function Products() {
  const { products } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'created') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    const styles = {
      publish: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      private: 'bg-gray-100 text-gray-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      publish: 'Publié',
      draft: 'Brouillon',
      private: 'Privé',
      pending: 'En attente'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getStockBadge = (stock: string) => {
    const styles = {
      instock: 'bg-green-100 text-green-800',
      outofstock: 'bg-red-100 text-red-800',
      onbackorder: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      instock: 'En stock',
      outofstock: 'Rupture',
      onbackorder: 'Commande'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[stock as keyof typeof styles]}`}>
        {labels[stock as keyof typeof labels]}
      </span>
    );
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmMessage = product.sku 
      ? `Êtes-vous sûr de vouloir supprimer "${product.name}" (SKU: ${product.sku}) de tous les sites ?`
      : `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`;
      
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingProduct(product.id);
    
    try {
      const sites = getSites();
      const manager = new WooCommerceManager(sites);
      
      if (product.sku) {
        // Supprimer par SKU sur tous les sites
        const results = await manager.deleteProductFromAllSites(product.sku);
        
        if (results.success.length > 0) {
          alert(`Produit supprimé avec succès de: ${results.success.join(', ')}`);
          window.location.reload();
        }
        
        if (results.failed.length > 0) {
          alert(`Erreur lors de la suppression sur: ${results.failed.join(', ')}`);
        }
      } else if (product.siteId) {
        // Supprimer sur un site spécifique
        const success = await manager.deleteProduct(product.id, product.siteId);
        
        if (success) {
          alert('Produit supprimé avec succès');
          window.location.reload();
        } else {
          alert('Erreur lors de la suppression du produit');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(`Erreur lors de la suppression du produit: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setDeletingProduct(null);
    }
  };

  const sites = getSites();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Message de succès */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Produit créé avec succès !
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Avertissement si aucun site configuré */}
        {sites.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Aucun site WooCommerce configuré
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Vous devez d'abord configurer au moins un site WooCommerce pour gérer vos produits.
                </p>
                <div className="mt-3">
                  <Link to="/sites/new">
                    <Button variant="outline" size="sm">
                      Configurer un site
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez tous vos produits WooCommerce ({products.length} produits)
            </p>
          </div>
          <Link to="/products/new">
            <Button disabled={sites.length === 0}>
              <Package className="h-4 w-4 mr-2" />
              Nouveau Produit
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
            <p className="mt-1 text-sm text-gray-500">
              {sites.length === 0 
                ? "Configurez d'abord un site WooCommerce pour commencer."
                : "Aucun produit trouvé sur vos sites WooCommerce."
              }
            </p>
            <div className="mt-6">
              {sites.length === 0 ? (
                <Link to="/sites/new">
                  <Button>
                    <Globe className="h-4 w-4 mr-2" />
                    Configurer un site
                  </Button>
                </Link>
              ) : (
                <Link to="/products/new">
                  <Button>
                    <Package className="h-4 w-4 mr-2" />
                    Créer votre premier produit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Products Table */
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sites
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={`${product.id}-${product.siteId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.featuredImage ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.featuredImage}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          {product.shortDescription && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {product.shortDescription.replace(/<[^>]*>/g, '')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.sku || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <span className="font-semibold">
                          {product.price.toLocaleString('fr-FR')} €
                        </span>
                        {product.salePrice && (
                          <div className="text-xs text-red-600">
                            Promo: {product.salePrice.toLocaleString('fr-FR')} €
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStockBadge(product.stockStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {product.sites?.length || 1}
                        </span>
                        {product.sites && product.sites.length > 1 && (
                          <div className="text-xs text-gray-400">
                            ({product.sites.join(', ')})
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link to={`/products/${product.id}/edit?siteId=${product.siteId}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProduct === product.id}
                        >
                          <Trash2 className={`h-4 w-4 ${deletingProduct === product.id ? 'animate-spin' : 'text-red-500'}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}