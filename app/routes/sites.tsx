import type { Route } from "./+types/sites";
import { Layout } from "~/components/Layout";
import { Link } from "react-router";
import { Globe, Plus, Edit, Trash2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sites WooCommerce - WooCommerce Manager" },
    { name: "description", content: "Gérez vos sites WooCommerce connectés" },
  ];
}

export default function Sites() {
  // Mock data - à remplacer par de vraies données
  const sites = [
    {
      id: '1',
      name: 'Site Nautique',
      url: 'https://site-nautique.com',
      active: true,
      lastSync: '2024-01-15 14:30',
      productsCount: 45,
      status: 'connected'
    },
    {
      id: '2',
      name: 'Marine Store',
      url: 'https://marine-store.fr',
      active: true,
      lastSync: '2024-01-15 12:15',
      productsCount: 32,
      status: 'connected'
    },
    {
      id: '3',
      name: 'Boat Shop',
      url: 'https://boat-shop.com',
      active: false,
      lastSync: '2024-01-10 09:45',
      productsCount: 28,
      status: 'error'
    },
    {
      id: '4',
      name: 'Nautique Pro',
      url: 'https://nautique-pro.fr',
      active: true,
      lastSync: '2024-01-15 16:20',
      productsCount: 67,
      status: 'connected'
    }
  ];

  const getStatusIcon = (status: string, active: boolean) => {
    if (!active) {
      return <XCircle className="h-5 w-5 text-gray-400" />;
    }
    
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string, active: boolean) => {
    if (!active) return 'Inactif';
    
    switch (status) {
      case 'connected':
        return 'Connecté';
      case 'error':
        return 'Erreur';
      case 'syncing':
        return 'Synchronisation...';
      default:
        return 'Déconnecté';
    }
  };

  const handleSync = (siteId: string) => {
    console.log('Synchronisation du site:', siteId);
    // Logique de synchronisation
  };

  const handleToggleActive = (siteId: string) => {
    console.log('Basculer l\'état actif du site:', siteId);
    // Logique pour activer/désactiver
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sites WooCommerce</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos sites WooCommerce connectés
            </p>
          </div>
          <Link to="/sites/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Site
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sites totaux</p>
                <p className="text-2xl font-semibold text-gray-900">{sites.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Connectés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites.filter(s => s.active && s.status === 'connected').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Erreurs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites.filter(s => s.status === 'error').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Produits sync</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sites.reduce((acc, site) => acc + site.productsCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sites List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sites connectés</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sites.map((site) => (
              <div key={site.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(site.status, site.active)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {site.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          site.active && site.status === 'connected'
                            ? 'bg-green-100 text-green-800'
                            : site.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(site.status, site.active)}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{site.url}</span>
                        <span>•</span>
                        <span>{site.productsCount} produits</span>
                        <span>•</span>
                        <span>Dernière sync: {site.lastSync}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(site.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Sync
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(site.id)}
                    >
                      {site.active ? 'Désactiver' : 'Activer'}
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}