import type { Route } from "./+types/home";
import { Layout } from "~/components/Layout";
import { Package, Globe, TrendingUp, AlertCircle } from "lucide-react";
import { useLoaderData } from "react-router";
import { WooCommerceManager } from "~/lib/woocommerce";
import { getSites } from "~/lib/sites";
import { SiteStats } from "~/types/product";

export async function loader(): Promise<{ stats: SiteStats }> {
  const sites = getSites();
  const manager = new WooCommerceManager(sites);
  
  let totalProducts = 0;
  let connectedSites = 0;
  let errorSites = 0;

  // Test de connexion pour chaque site
  for (const site of sites) {
    try {
      const isConnected = await manager.testSiteConnection(site);
      if (isConnected) {
        connectedSites++;
        // Compter les produits pour les sites connectés
        try {
          const products = await manager.getAllProducts();
          totalProducts = products.length;
        } catch (error) {
          console.error('Erreur lors du comptage des produits:', error);
        }
      } else {
        errorSites++;
      }
    } catch (error) {
      errorSites++;
    }
  }

  const stats: SiteStats = {
    totalSites: sites.length,
    connectedSites,
    errorSites,
    totalProducts,
  };

  return { stats };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - WooCommerce Manager" },
    { name: "description", content: "Gérez vos produits WooCommerce sur plusieurs sites" },
  ];
}

export default function Home() {
  const { stats } = useLoaderData<typeof loader>();

  const statCards = [
    {
      name: 'Produits totaux',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: '',
      changeType: 'neutral' as const,
    },
    {
      name: 'Sites connectés',
      value: stats.connectedSites.toString(),
      icon: Globe,
      change: `/${stats.totalSites}`,
      changeType: stats.connectedSites === stats.totalSites ? 'positive' : 'neutral' as const,
    },
    {
      name: 'Sites actifs',
      value: stats.totalSites.toString(),
      icon: TrendingUp,
      change: '',
      changeType: 'positive' as const,
    },
    {
      name: 'Erreurs',
      value: stats.errorSites.toString(),
      icon: AlertCircle,
      change: '',
      changeType: stats.errorSites > 0 ? 'negative' : 'positive' as const,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d'ensemble de vos produits et sites WooCommerce
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
              >
                <dt>
                  <div className="absolute bg-blue-500 rounded-md p-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {stat.change}
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </div>

        {/* Info sur la configuration */}
        {stats.totalSites === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Aucun site configuré
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Vous devez configurer au moins un site WooCommerce pour commencer.
                    Allez dans la section "Sites WooCommerce" pour ajouter vos sites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {stats.errorSites > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreurs de connexion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {stats.errorSites} site(s) ne peuvent pas être contactés. 
                    Vérifiez la configuration de vos clés API dans la section "Sites WooCommerce".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}