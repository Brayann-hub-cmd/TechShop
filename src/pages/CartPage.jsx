import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { MEDIA_URL } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchPanier();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchPanier = async () => {
    try {
      setLoading(true);
      const response = await api.get('panier/');
      setPanier(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le panier');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (ligneId) => {
    try {
      await api.delete(`panier/supprimer/${ligneId}/`);
      toast.success('Produit retire du panier');
      fetchPanier();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleViderPanier = async () => {
    if (!confirm('Voulez-vous vraiment vider votre panier ?')) return;
    try {
      await api.post('panier/vider/');
      toast.success('Panier vide avec succes');
      fetchPanier();
    } catch (err) {
      toast.error('Erreur lors du vidage du panier');
    }
  };

  const handleImageError = (ligneId) => {
    setImageErrors({ ...imageErrors, [ligneId]: true });
  };

  const getImageUrl = (ligne) => {
    if (ligne.produit_image && !imageErrors[ligne.id]) {
      return `${MEDIA_URL}${ligne.produit_image}`;
    }
    return null;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <FiShoppingBag className="text-6xl mx-auto mb-4 text-[#9370DB]" />
          <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
          <p className="text-gray-500 mb-6">Connectez-vous pour acceder a votre panier</p>
          <Link to="/login" className="bg-[#9370DB] text-white px-6 py-2 rounded-lg hover:bg-[#800080] transition">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (!panier || !panier.lignes || panier.lignes.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <FiShoppingBag className="text-6xl mx-auto mb-4 text-[#9370DB]" />
          <h2 className="text-2xl font-bold mb-4">Panier vide</h2>
          <p className="text-gray-500 mb-6">Decouvrez nos produits et remplissez votre panier</p>
          <Link to="/catalogue" className="bg-[#9370DB] text-white px-6 py-2 rounded-lg hover:bg-[#800080] transition">
            Voir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiShoppingBag />
          <span>Mon Panier</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {panier.lignes.map((ligne) => (
              <div key={ligne.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {getImageUrl(ligne) ? (
                      <img
                        src={getImageUrl(ligne)}
                        alt={ligne.produit_nom}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(ligne.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-2xl text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ligne.produit_nom}</h3>
                    <p className="text-[#9370DB] font-bold">
                      {ligne.prix_unitaire?.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Qte: {ligne.quantite}</p>
                    <p className="font-bold text-lg">
                      {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 p-2"
                    onClick={() => handleRemoveItem(ligne.id)}
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}

            <button
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              onClick={handleViderPanier}
            >
              <FiTrash2 />
              <span>Vider le panier</span>
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-[#800080] mb-4">Resume</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{panier.total?.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#9370DB]">{panier.total?.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                className="w-full bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition mt-6 flex items-center justify-center gap-2"
                onClick={() => navigate('/checkout')}
              >
                <span>Commander</span>
                <FiArrowRight />
              </button>

              <Link
                to="/catalogue"
                className="block text-center mt-4 text-[#9370DB] hover:text-[#800080] text-sm"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;