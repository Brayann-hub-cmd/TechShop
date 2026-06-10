import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiGrid,
  FiList
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    produits: 0,
    commandes: 0,
    clients: 0,
    revenus: 0,
  });
  const [commandesRecentes, setCommandesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [produitsRes, commandesRes] = await Promise.all([
        api.get('produits/'),
        api.get('commandes/'),
      ]);

      const produits = produitsRes.data.results || produitsRes.data;
      const commandes = commandesRes.data.results || commandesRes.data;

      setStats({
        produits: produits.length,
        commandes: commandes.length,
        clients: [...new Set(commandes.map(c => c.client))].length,
        revenus: commandes
          .filter(c => c.statut !== 'annulee')
          .reduce((acc, c) => acc + (c.montant_total || 0), 0),
      });

      setCommandesRecentes(commandes.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Impossible de charger les donnees du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const statCards = [
    {
      title: 'Produits',
      value: stats.produits,
      icon: <FiPackage className="text-3xl" />,
      color: 'bg-blue-500',
      link: '/admin/produits',
    },
    {
      title: 'Commandes',
      value: stats.commandes,
      icon: <FiShoppingCart className="text-3xl" />,
      color: 'bg-green-500',
      link: '/admin/commandes',
    },
    {
      title: 'Clients',
      value: stats.clients,
      icon: <FiUsers className="text-3xl" />,
      color: 'bg-purple-500',
      link: '/admin/clients',
    },
    {
      title: 'Revenus',
      value: `${stats.revenus.toLocaleString()} FCFA`,
      icon: <FiDollarSign className="text-3xl" />,
      color: 'bg-yellow-500',
      link: '/admin/commandes',
    },
  ];

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#800080] flex items-center gap-2">
            <FiTrendingUp />
            <span>Tableau de bord</span>
          </h1>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <FiTrendingUp className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/admin/produits"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-[#9370DB] text-white p-3 rounded-lg">
              <FiGrid className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Gerer les produits</h3>
              <p className="text-gray-500 text-sm">Ajouter, modifier ou supprimer des produits</p>
            </div>
          </Link>

          <Link
            to="/admin/commandes"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-[#9370DB] text-white p-3 rounded-lg">
              <FiList className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Gerer les commandes</h3>
              <p className="text-gray-500 text-sm">Voir et mettre a jour les commandes</p>
            </div>
          </Link>
        </div>

        {/* Commandes recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#800080] mb-4 flex items-center gap-2">
            <FiShoppingCart />
            <span>Commandes recentes</span>
          </h2>

          {commandesRecentes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commandesRecentes.map((commande) => (
                    <tr key={commande.id}>
                      <td className="text-sm">#{commande.id?.slice(0, 8)}</td>
                      <td>{commande.client_nom || 'Client'}</td>
                      <td className="font-semibold">{commande.montant_total?.toLocaleString()} FCFA</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          commande.statut === 'confirmee' ? 'bg-blue-100 text-blue-800' :
                          commande.statut === 'en_livraison' ? 'bg-purple-100 text-purple-800' :
                          commande.statut === 'livree' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {commande.statut}
                        </span>
                      </td>
                      <td className="text-sm">
                        {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <Link
                          to={`/admin/commandes`}
                          className="text-[#9370DB] hover:text-[#800080]"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune commande recente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;