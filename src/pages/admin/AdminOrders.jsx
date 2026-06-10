import { useState, useEffect } from 'react';
import api from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  FiPackage, 
  FiEye, 
  FiX, 
  FiTruck, 
  FiCheck,
  FiClock,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCommandes();
  }, []);

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

  const handleUpdateStatus = async (id, nouveauStatut) => {
    try {
      setUpdating(true);
      await api.patch(`commandes/${id}/`, { statut: nouveauStatut });
      toast.success('Statut mis a jour avec succes');
      fetchCommandes();
      if (selectedCommande?.id === id) {
        fetchCommandeDetail(id);
      }
    } catch (err) {
      toast.error('Erreur lors de la mise a jour');
    } finally {
      setUpdating(false);
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

  const filteredCommandes = commandes.filter(commande => {
    const matchFilter = filter ? commande.statut === filter : true;
    const matchSearch = searchTerm
      ? commande.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.client_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiPackage />
          <span>Gestion des commandes</span>
        </h1>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher par ID ou client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#9370DB] focus:border-[#9370DB]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirmee">Confirmee</option>
              <option value="en_livraison">En livraison</option>
              <option value="livree">Livree</option>
              <option value="annulee">Annulee</option>
            </select>
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-[#E6E6FA]">
                  <th>ID Commande</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommandes.map((commande) => {
                  const status = getStatusBadge(commande.statut);
                  return (
                    <tr key={commande.id}>
                      <td className="text-sm font-medium">
                        #{commande.id?.slice(0, 8)}
                      </td>
                      <td>{commande.client_nom || 'Client'}</td>
                      <td className="font-semibold">
                        {commande.montant_total?.toLocaleString()} FCFA
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${status.color}`}>
                          {status.icon}
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td className="text-sm">
                        {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="text-[#9370DB] hover:text-[#800080] p-1"
                            onClick={() => fetchCommandeDetail(commande.id)}
                          >
                            <FiEye />
                          </button>
                          {commande.statut === 'en_attente' && (
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1"
                              onClick={() => handleUpdateStatus(commande.id, 'confirmee')}
                              title="Confirmer"
                            >
                              <FiCheck />
                            </button>
                          )}
                          {commande.statut === 'confirmee' && (
                            <button
                              className="text-purple-500 hover:text-purple-700 p-1"
                              onClick={() => handleUpdateStatus(commande.id, 'en_livraison')}
                              title="Mettre en livraison"
                            >
                              <FiTruck />
                            </button>
                          )}
                          {commande.statut === 'en_livraison' && (
                            <button
                              className="text-green-500 hover:text-green-700 p-1"
                              onClick={() => handleUpdateStatus(commande.id, 'livree')}
                              title="Marquer comme livree"
                            >
                              <FiPackage />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCommandes.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucune commande trouvee</p>
          )}
        </div>
      </div>

      {/* Modal Details */}
      {selectedCommande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="space-y-6">
                {/* Infos generales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedCommande.date_commande).toLocaleDateString('fr-FR')}
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
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-semibold">{selectedCommande.client_nom || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-[#9370DB]">
                      {selectedCommande.montant_total?.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                <hr />

                {/* Produits */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Produits commandes</h3>
                  <div className="space-y-2">
                    {selectedCommande.lignes?.map((ligne, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium">{ligne.produit_nom}</p>
                          <p className="text-sm text-gray-500">
                            Prix unitaire: {ligne.prix_unitaire?.toLocaleString()} FCFA
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Qte: {ligne.quantite}</p>
                          <p className="font-semibold">
                            {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                {/* Paiement */}
                {selectedCommande.paiements && selectedCommande.paiements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Paiement</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Mode: {selectedCommande.paiements[0].mode_paiement}</span>
                        <span className={`font-semibold ${
                          selectedCommande.paiements[0].statut === 'valide' ? 'text-green-600' :
                          selectedCommande.paiements[0].statut === 'echoue' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedCommande.paiements[0].statut}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Livraison */}
                {selectedCommande.livraison && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Livraison</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">Adresse: {selectedCommande.livraison.adresse_livraison}</p>
                      {selectedCommande.livraison.numero_colis && (
                        <p className="text-sm">Colis: {selectedCommande.livraison.numero_colis}</p>
                      )}
                      {selectedCommande.livraison.date_livraison && (
                        <p className="text-sm">
                          Date livraison: {new Date(selectedCommande.livraison.date_livraison).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  {selectedCommande.statut === 'en_attente' && (
                    <button
                      className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                      onClick={() => handleUpdateStatus(selectedCommande.id, 'confirmee')}
                      disabled={updating}
                    >
                      <FiCheck />
                      <span>Confirmer la commande</span>
                    </button>
                  )}
                  {selectedCommande.statut === 'confirmee' && (
                    <button
                      className="flex-1 bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2"
                      onClick={() => handleUpdateStatus(selectedCommande.id, 'en_livraison')}
                      disabled={updating}
                    >
                      <FiTruck />
                      <span>Mettre en livraison</span>
                    </button>
                  )}
                  {selectedCommande.statut === 'en_livraison' && (
                    <button
                      className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                      onClick={() => handleUpdateStatus(selectedCommande.id, 'livree')}
                      disabled={updating}
                    >
                      <FiPackage />
                      <span>Marquer comme livree</span>
                    </button>
                  )}
                  <button
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
                    onClick={() => setSelectedCommande(null)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;