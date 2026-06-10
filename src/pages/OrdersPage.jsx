import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchCommandes();
    }
  }, [token]);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const response = await api.get('commandes/');
      setCommandes(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommandeDetail = async (id) => {
    try {
      const response = await api.get(`commandes/${id}/`);
      setSelectedCommande(response.data);
    } catch (err) {
      toast.error('Impossible de charger les details');
    }
  };

  const handleAnnulerCommande = async (id) => {
    if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    
    try {
      await api.post(`commandes/${id}/annuler/`);
      toast.success('Commande annulee avec succes');
      fetchCommandes();
      setSelectedCommande(null);
    } catch (err) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const getStatusBadge = (statut) => {
    const statuses = {
      en_attente: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, label: 'En attente' },
      confirmee: { color: 'bg-blue-100 text-blue-800', icon: <FiCheck />, label: 'Confirmee' },
      en_livraison: { color: 'bg-purple-100 text-purple-800', icon: <FiTruck />, label: 'En livraison' },
      livree: { color: 'bg-green-100 text-green-800', icon: <FiPackage />, label: 'Livree' },
      annulee: { color: 'bg-red-100 text-red-800', icon: <FiX />, label: 'Annulee' },
    };
    return statuses[statut] || statuses.en_attente;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiPackage className="text-6xl mx-auto mb-4 text-[#9370DB]" />
          <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
          <p className="text-gray-500 mb-6">Connectez-vous pour voir vos commandes</p>
          <Link to="/login" className="bg-[#9370DB] text-white px-6 py-2 rounded-lg hover:bg-[#800080] transition">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiPackage />
          <span>Mes Commandes</span>
        </h1>

        {commandes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiPackage className="text-6xl mx-auto mb-4 text-[#9370DB]" />
            <h2 className="text-2xl font-bold mb-4">Aucune commande</h2>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore passe de commande</p>
            <Link to="/catalogue" className="bg-[#9370DB] text-white px-6 py-2 rounded-lg hover:bg-[#800080] transition">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {commandes.map((commande) => {
              const status = getStatusBadge(commande.statut);
              return (
                <div key={commande.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">#{commande.id?.slice(0, 8)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
                          {status.icon}
                          <span>{status.label}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-[#9370DB]">
                        {commande.montant_total?.toLocaleString()} FCFA
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="border border-[#9370DB] text-[#9370DB] px-4 py-2 rounded-lg hover:bg-[#9370DB] hover:text-white transition text-sm flex items-center gap-1"
                        onClick={() => fetchCommandeDetail(commande.id)}
                      >
                        <FiEye />
                        <span>Details</span>
                      </button>
                      {commande.statut === 'en_attente' && (
                        <button
                          className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
                          onClick={() => handleAnnulerCommande(commande.id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Details */}
        {selectedCommande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#800080]">
                    Commande #{selectedCommande.id?.slice(0, 8)}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => setSelectedCommande(null)}
                  >
                    <FiX />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">
                        {new Date(selectedCommande.date_commande).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        getStatusBadge(selectedCommande.statut).color
                      }`}>
                        {getStatusBadge(selectedCommande.statut).icon}
                        <span>{getStatusBadge(selectedCommande.statut).label}</span>
                      </span>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <h3 className="font-semibold mb-2">Produits</h3>
                    <div className="space-y-2">
                      {selectedCommande.lignes?.map((ligne, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{ligne.produit_nom}</p>
                            <p className="text-sm text-gray-500">Qte: {ligne.quantite}</p>
                          </div>
                          <p className="font-semibold">
                            {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} FCFA
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#9370DB]">
                      {selectedCommande.montant_total?.toLocaleString()} FCFA
                    </span>
                  </div>

                  <button
                    className="w-full bg-[#9370DB] text-white font-semibold py-2 rounded-lg hover:bg-[#800080] transition mt-4"
                    onClick={() => setSelectedCommande(null)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;