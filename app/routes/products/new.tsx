import type { Route } from "../+types/products/new";
import { Layout } from "~/components/Layout";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { Select } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ImageUpload";
import { useState, useEffect } from "react";
import { Save, ArrowLeft, Globe } from "lucide-react";
import { Link, useActionData } from "react-router";
import { WooCommerceManager } from "~/lib/woocommerce";
import { getSites } from "~/lib/sites";
import { ProductFormData } from "~/types/product";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productData = JSON.parse(formData.get('productData') as string) as ProductFormData;
  
  try {
    const sites = getSites();
    const manager = new WooCommerceManager(sites);
    
    const createdProducts = await manager.createProduct(productData, productData.selectedSites);
    
    return {
      success: true,
      message: `Produit créé avec succès sur ${createdProducts.length} site(s)`,
      products: createdProducts,
    };
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return {
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nouveau Produit - WooCommerce Manager" },
    { name: "description", content: "Créer un nouveau produit WooCommerce" },
  ];
}

export default function NewProduct() {
  const actionData = useActionData<typeof action>();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    regularPrice: 0,
    salePrice: undefined,
    manageStock: false,
    stockQuantity: undefined,
    stockStatus: 'instock',
    weight: undefined,
    dimensions: {
      length: undefined,
      width: undefined,
      height: undefined,
    },
    categories: ['Highlights', 'St-Tropez', 'Monaco - Nice', 'Corse', 'Antibes - Cannes'],
    tags: [],
    images: [],
    status: 'draft',
    catalogVisibility: 'visible',
    featured: false,
    virtual: false,
    downloadable: false,
    selectedSites: [],
  });

  const [loading, setLoading] = useState(false);
  const [availableSites, setAvailableSites] = useState(getSites());

  useEffect(() => {
    if (actionData?.success) {
      alert(actionData.message);
      // Optionnel: rediriger vers la liste des produits
      // window.location.href = '/products';
    } else if (actionData?.success === false) {
      alert(`Erreur: ${actionData.message}`);
    }
  }, [actionData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const form = new FormData();
    form.append('productData', JSON.stringify(formData));
    
    try {
      await fetch('/products/new', {
        method: 'POST',
        body: form,
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteToggle = (siteId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSites: prev.selectedSites.includes(siteId)
        ? prev.selectedSites.filter(id => id !== siteId)
        : [...prev.selectedSites, siteId]
    }));
  };

  // Template de description avec shortcode pour les bateaux
  const handleUseBoatTemplate = () => {
    const boatDescription = `[vc_row type="in_container" full_screen_row_position="middle" column_margin="default" column_direction="default" column_direction_tablet="default" column_direction_phone="default" scene_position="center" text_color="#fff" text_align="left" row_border_radius="none" row_border_radius_applies="bg" overflow="visible" overlay_strength="0.9" gradient_direction="left_to_right" shape_divider_position="bottom" bg_image_animation="none"][vc_column column_padding="padding-1-percent" column_padding_tablet="inherit" column_padding_phone="inherit" column_padding_position="all" column_element_spacing="default" background_color_opacity="1" background_hover_color_opacity="1" column_shadow="none" column_border_radius="none" column_link_target="_self" column_position="default" advanced_gradient_angle="0" gradient_direction="left_to_right" overlay_strength="0.3" width="1/1" tablet_width_inherit="default" tablet_text_alignment="default" phone_text_alignment="default" animation_type="default" bg_image_animation="none" border_type="simple" column_border_width="1px" column_border_color="#0a0a0a" column_border_style="solid" enable_border_animation="true" gradient_type="default"][nectar_icon_list animate="true" color="default" direction="vertical" icon_size="small" icon_style="border"][nectar_icon_list_item icon_type="icon" text_full_html="html" title="List Item" id="1713860757178-3" tab_id="1713860757178-5" icon_fontawesome="fa fa-anchor"]<strong>Constructeur:</strong> Leopard (Arno)

<strong>Longueur:</strong> 26.96 m | <strong>Largeur:</strong> 6.05 m

<strong>Cabines: </strong>4[/nectar_icon_list_item][nectar_icon_list_item icon_type="icon" text_full_html="html" title="List Item" id="1713860757192-8" tab_id="1713860757192-10" icon_fontawesome="fa fa-users"]<strong>Passagers en navigation:</strong> 12

<strong>Couchage:</strong> 10 personnes

<strong>Équipage:</strong> 3[/nectar_icon_list_item][nectar_icon_list_item icon_type="icon" text_full_html="html" title="List Item" id="1713860757197-0" tab_id="1713860757197-1" icon_fontawesome="fa fa-cogs"]<strong>Vitesse de croisière:</strong> 22 noeuds

<strong>Consommation: </strong>450 L/H[/nectar_icon_list_item][/nectar_icon_list][/vc_column][/vc_row]`;

    setFormData(prev => ({
      ...prev,
      description: boatDescription
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
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
            >
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
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUseBoatTemplate}
                      >
                        Template Bateau
                      </Button>
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description détaillée du produit..."
                      rows={8}
                    />
                  </div>
                  
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
                    value={formData.regularPrice.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, regularPrice: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    required
                  />
                  
                  <Input
                    label="Prix de vente (€)"
                    type="number"
                    value={formData.salePrice?.toString() || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
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
                      value={formData.stockQuantity?.toString() || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value ? parseInt(e.target.value) : undefined }))}
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
                    value={formData.weight?.toString() || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="0.00"
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Dimensions (m)</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Longueur"
                        type="number"
                        value={formData.dimensions.length?.toString() || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { 
                            ...prev.dimensions, 
                            length: e.target.value ? parseFloat(e.target.value) : undefined 
                          }
                        }))}
                        placeholder="0.00"
                      />
                      <Input
                        label="Largeur"
                        type="number"
                        value={formData.dimensions.width?.toString() || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { 
                            ...prev.dimensions, 
                            width: e.target.value ? parseFloat(e.target.value) : undefined 
                          }
                        }))}
                        placeholder="0.00"
                      />
                      <Input
                        label="Hauteur"
                        type="number"
                        value={formData.dimensions.height?.toString() || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { 
                            ...prev.dimensions, 
                            height: e.target.value ? parseFloat(e.target.value) : undefined 
                          }
                        }))}
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
                      value={formData.categories.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        categories: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                      }))}
                      placeholder="Séparez par des virgules"
                      className="w-full rounded-md border-gray-300 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Catégories par défaut: Highlights, St-Tropez, Monaco - Nice, Corse, Antibes - Cannes
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Étiquettes
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      }))}
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