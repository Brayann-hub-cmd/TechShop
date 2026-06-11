import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { MEDIA_URL } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiPackage, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduit();
  }, [id]);

  const fetchProduit = async () => {
    try {
      setLoading(true);
      const response = await api.get(`produits/${id}/`);
      setProduit(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await api.post('panier/ajouter/', {
        produit_id: produit.id,
        quantite: quantity,
      });
      
      toast.success(`${produit.nom} ajoute au panier`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = () => {
    if (produit?.image && !imageError) {
      return `${produit.image}`;
    }
    return null;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!produit) return <ErrorMessage message="Produit introuvable" />;

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#9370DB]">Accueil</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/catalogue')} className="hover:text-[#9370DB]">Catalogue</button>
          <span className="mx-2">/</span>
          <span className="text-[#9370DB]">{produit.nom}</span>
        </div>

        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-[#9370DB] mb-6 flex items-center gap-2">
          <FiArrowLeft />
          <span>Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            {getImageUrl() ? (
              <img
                src={getImageUrl()}
                alt={produit.nom}
                className="w-full h-96 object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <FiImage className="text-6xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400">Aucune image disponible</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="inline-block bg-[#E6E6FA] text-[#800080] px-3 py-1 rounded-full text-sm mb-4">
              {produit.categorie_nom || 'Non categorise'}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{produit.nom}</h1>
            
            <div className="text-4xl font-bold text-[#9370DB] mb-6">
              {produit.prix?.toLocaleString()} FCFA
            </div>

            <div className="mb-6">
              {produit.stock > 10 ? (
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <FiPackage />
                  <span>En stock ({produit.stock} disponibles)</span>
                </span>
              ) : produit.stock > 0 ? (
                <span className="text-orange-600 font-semibold">
                  Plus que {produit.stock} en stock
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Rupture de stock</span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[#800080]">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {produit.description || 'Aucune description disponible.'}
              </p>
            </div>

            {produit.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-semibold">Quantite :</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      className="px-4 py-2 hover:bg-gray-100 flex items-center"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      className="w-16 text-center border-x border-gray-300 py-2"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= produit.stock) setQuantity(val);
                      }}
                      min="1"
                      max={produit.stock}
                    />
                    <button
                      className="px-4 py-2 hover:bg-gray-100 flex items-center"
                      onClick={() => quantity < produit.stock && setQuantity(quantity + 1)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <button
                  className="w-full bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  <FiShoppingCart />
                  <span>{addingToCart ? 'Ajout...' : 'Ajouter au panier'}</span>
                </button>

                <p className="text-center text-gray-500">
                  Total : {(produit.prix * quantity).toLocaleString()} FCFA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;