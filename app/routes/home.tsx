import type { Route } from "./+types/home";
import { Layout } from "~/components/Layout";
import { Package, Globe, TrendingUp, Users } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - WooCommerce Manager" },
    { name: "description", content: "Gérez vos produits WooCommerce sur plusieurs sites" },
  ];
}

export default function Home() {
  const stats = [
    {
      name: 'Produits totaux',
      value: '124',
      icon: Package,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Sites connectés',
      value: '8',
      icon: Globe,
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      name: 'Synchronisations',
      value: '1,429',
      icon: TrendingUp,
      change: '+5.4%',
      changeType: 'positive' as const,
    },
    {
      name: 'Erreurs',
      value: '3',
      icon: Users,
      change: '-2',
      changeType: 'negative' as const,
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
          {stats.map((stat) => {
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
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </dd>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Activité récente
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[
                    {
                      id: 1,
                      content: 'Produit "Catamaran Leopard 40" synchronisé sur 3 sites',
                      time: 'Il y a 2 heures',
                      type: 'success',
                    },
                    {
                      id: 2,
                      content: 'Nouveau site "Boutique Marine" ajouté',
                      time: 'Il y a 4 heures',
                      type: 'info',
                    },
                    {
                      id: 3,
                      content: 'Erreur de synchronisation sur "Site Nautique Pro"',
                      time: 'Il y a 6 heures',
                      type: 'error',
                    },
                  ].map((item, itemIdx) => (
                    <li key={item.id}>
                      <div className="relative pb-8">
                        {itemIdx !== 2 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                item.type === 'success'
                                  ? 'bg-green-500'
                                  : item.type === 'error'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                            >
                              <Package className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {item.content}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}