import type { Route } from "../+types/sites/new";
import { Layout } from "~/components/Layout";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { useState } from "react";
import { Save, ArrowLeft, TestTube, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nouveau Site - WooCommerce Manager" },
    { name: "description", content: "Ajouter un nouveau site WooCommerce" },
  ];
}

export default function NewSite() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    consumerKey: '',
    consumerSecret: ''
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Données du site:', formData);
    setLoading(false);
    
    // Redirection vers la liste des sites
    // navigate('/sites');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulation d'un test de connexion
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulation d'un résultat aléatoire
    const success = Math.random() > 0.3;
    setTestResult(success ? 'success' : 'error');
    setTesting(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/sites">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Site WooCommerce</h1>
              <p className="text-sm text-gray-500">
                Connectez un nouveau site WooCommerce à votre dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Comment obtenir vos clés API WooCommerce
          </h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Connectez-vous à votre admin WordPress</li>
            <li>Allez dans WooCommerce → Réglages → Avancé → API REST</li>
            <li>Cliquez sur "Ajouter une clé"</li>
            <li>Donnez un nom à votre clé (ex: "Dashboard Manager")</li>
            <li>Sélectionnez "Lecture/Écriture" pour les permissions</li>
            <li>Copiez la Clé client et le Secret client</li>
          </ol>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations du site
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Nom du site *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Ma Boutique Nautique"
                required
              />
              
              <Input
                label="URL du site *"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://monsite.com"
                helperText="L'URL complète de votre site WooCommerce"
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Authentification API
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Clé client (Consumer Key) *"
                value={formData.consumerKey}
                onChange={(e) => setFormData(prev => ({ ...prev, consumerKey: e.target.value }))}
                placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
              />
              
              <Input
                label="Secret client (Consumer Secret) *"
                type="password"
                value={formData.consumerSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, consumerSecret: e.target.value }))}
                placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
              />
            </div>

            {/* Test de connexion */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Test de connexion
                  </h3>
                  <p className="text-sm text-gray-500">
                    Vérifiez que les informations sont correctes
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  loading={testing}
                  disabled={!formData.url || !formData.consumerKey || !formData.consumerSecret}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Tester
                </Button>
              </div>
              
              {testResult && (
                <div className={`mt-3 p-3 rounded-md ${
                  testResult === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {testResult === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      testResult === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult === 'success' 
                        ? 'Connexion réussie !' 
                        : 'Erreur de connexion'
                      }
                    </span>
                  </div>
                  {testResult === 'error' && (
                    <p className="mt-1 text-sm text-red-700">
                      Vérifiez vos clés API et l'URL du site. Assurez-vous que WooCommerce est installé et que l'API REST est activée.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Link to="/sites">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Ajouter le Site
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}