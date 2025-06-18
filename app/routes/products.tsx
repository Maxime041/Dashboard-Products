import type { Route } from "./+types/products";
import { Layout } from "~/components/Layout";
import { Link } from "react-router";
import { Package, Edit, Trash2, Eye, Globe } from "lucide-react";
import { Button } from "~/components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Produits - WooCommerce Manager" },
    { name: "description", content: "Gérez tous vos produits WooCommerce" },
  ];
}

export default function Products() {
  // Mock data - à remplacer par de vraies données
  const products = [
    {
      id: '1',
      name: 'Catamaran Leopard 40',
      sku: 'CAT-LEO-40',
      price: 450000,
      status: 'publish',
      stock: 'instock',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      sites: ['Site Nautique', 'Marine Store', 'Boat Shop'],
      lastSync: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Voilier Bavaria 46',
      sku: 'VOIL-BAV-46',
      price: 280000,
      status: 'publish',
      stock: 'instock',
      image: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=400',
      sites: ['Site Nautique', 'Boat Shop'],
      lastSync: '2024-01-15 12:15'
    },
    {
      id: '3',
      name: 'Yacht Princess 60',
      sku: 'YACHT-PRIN-60',
      price: 850000,
      status: 'draft',
      stock: 'outofstock',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      sites: [],
      lastSync: null
    }
  ];

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez tous vos produits WooCommerce
            </p>
          </div>
          <Link to="/products/new">
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Nouveau Produit
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <select className="rounded-md border-gray-300 text-sm">
              <option>Tous les statuts</option>
              <option>Publié</option>
              <option>Brouillon</option>
              <option>Privé</option>
            </select>
            <select className="rounded-md border-gray-300 text-sm">
              <option>Tous les stocks</option>
              <option>En stock</option>
              <option>Rupture</option>
              <option>Sur commande</option>
            </select>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="rounded-md border-gray-300 text-sm flex-1 min-w-64"
            />
          </div>
        </div>

        {/* Products Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière sync
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockBadge(product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {product.sites.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.lastSync || 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link to={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}