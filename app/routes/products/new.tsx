import type { Route } from "../+types/products/new";
import { Layout } from "~/components/Layout";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { Select } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ImageUpload";
import { useState } from "react";
import { Save, ArrowLeft, Globe } from "lucide-react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nouveau Produit - WooCommerce Manager" },
    { name: "description", content: "Créer un nouveau produit WooCommerce" },
  ];
}

export default function NewProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    regularPrice: '',
    salePrice: '',
    manageStock: false,
    stockQuantity: '',
    stockStatus: 'instock',
    weight: '',
    length: '',
    width: '',
    height: '',
    categories: [] as string[],
    tags: [] as string[],
    images: [] as string[],
    status: 'draft',
    catalogVisibility: 'visible',
    featured: false,
    virtual: false,
    downloadable: false,
    selectedSites: [] as string[]
  });

  const [loading, setLoading] = useState(false);

  // Mock data pour les sites
  const availableSites = [
    { id: '1', name: 'Site Nautique', url: 'https://site-nautique.com' },
    { id: '2', name: 'Marine Store', url: 'https://marine-store.fr' },
    { id: '3', name: 'Boat Shop', url: 'https://boat-shop.com' },
    { id: '4', name: 'Nautique Pro', url: 'https://nautique-pro.fr' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Données du produit:', formData);
    setLoading(false);
    
    // Redirection vers la liste des produits
    // navigate('/products');
  };

  const handleSiteToggle = (siteId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSites: prev.selectedSites.includes(siteId)
        ? prev.selectedSites.filter(id => id !== siteId)
        : [...prev.selectedSites, siteId]
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Produit</h1>
              <p className="text-sm text-gray-500">
                Créer un nouveau produit pour vos sites WooCommerce
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" type="button">
              Enregistrer comme brouillon
            </Button>
            <Button type="submit" form="product-form" loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations générales */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Informations générales
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Nom du produit *"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Catamaran Leopard 40"
                    required
                  />
                  
                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description détaillée du produit..."
                    rows={6}
                  />
                  
                  <Textarea
                    label="Description courte"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Résumé du produit..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Images du produit
                </h2>
                <ImageUpload
                  label="Images"
                  multiple={true}
                  value={formData.images}
                  onChange={(images) => setFormData(prev => ({ ...prev, images: images as string[] }))}
                  maxFiles={10}
                />
              </div>

              {/* Prix et inventaire */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Prix et inventaire
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Prix régulier (€) *"
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, regularPrice: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                  
                  <Input
                    label="Prix de vente (€)"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="0.00"
                  />
                  
                  <Input
                    label="SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Ex: CAT-LEO-40"
                  />
                  
                  <Select
                    label="Statut du stock"
                    value={formData.stockStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockStatus: e.target.value as any }))}
                    options={[
                      { value: 'instock', label: 'En stock' },
                      { value: 'outofstock', label: 'Rupture de stock' },
                      { value: 'onbackorder', label: 'Sur commande' }
                    ]}
                  />
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.manageStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, manageStock: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Gérer le stock pour ce produit
                    </span>
                  </label>
                </div>
                
                {formData.manageStock && (
                  <div className="mt-4">
                    <Input
                      label="Quantité en stock"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              {/* Expédition */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Expédition
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Poids (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="0.00"
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Dimensions (m)</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Longueur"
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                        placeholder="0.00"
                      />
                      <Input
                        label="Largeur"
                        type="number"
                        value={formData.width}
                        onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                        placeholder="0.00"
                      />
                      <Input
                        label="Hauteur"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Publication
                </h2>
                <div className="space-y-4">
                  <Select
                    label="Statut"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    options={[
                      { value: 'draft', label: 'Brouillon' },
                      { value: 'pending', label: 'En attente' },
                      { value: 'private', label: 'Privé' },
                      { value: 'publish', label: 'Publié' }
                    ]}
                  />
                  
                  <Select
                    label="Visibilité catalogue"
                    value={formData.catalogVisibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, catalogVisibility: e.target.value as any }))}
                    options={[
                      { value: 'visible', label: 'Boutique et recherche' },
                      { value: 'catalog', label: 'Boutique uniquement' },
                      { value: 'search', label: 'Recherche uniquement' },
                      { value: 'hidden', label: 'Masqué' }
                    ]}
                  />
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Produit mis en avant
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.virtual}
                        onChange={(e) => setFormData(prev => ({ ...prev, virtual: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Produit virtuel
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.downloadable}
                        onChange={(e) => setFormData(prev => ({ ...prev, downloadable: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Produit téléchargeable
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sites de destination */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <Globe className="h-5 w-5 inline mr-2" />
                  Sites de destination
                </h2>
                <div className="space-y-3">
                  {availableSites.map((site) => (
                    <label key={site.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.selectedSites.includes(site.id)}
                        onChange={() => handleSiteToggle(site.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {site.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {site.url}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Sélectionnez les sites sur lesquels publier ce produit
                </p>
              </div>

              {/* Catégories et tags */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Organisation
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégories
                    </label>
                    <input
                      type="text"
                      placeholder="Séparez par des virgules"
                      className="w-full rounded-md border-gray-300 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Étiquettes
                    </label>
                    <input
                      type="text"
                      placeholder="Séparez par des virgules"
                      className="w-full rounded-md border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}