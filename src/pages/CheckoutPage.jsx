import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MEDIA_URL } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiCreditCard, FiSmartphone, FiDollarSign, FiMapPin, FiPhone, FiCheck, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  const [livraison, setLivraison] = useState({
    adresse_livraison: '',
    telephone: '',
  });
  
  const [paiement, setPaiement] = useState({
    mode_paiement: 'mobile_money',
  });

  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchPanier();
      setLivraison({
        adresse_livraison: userData.adresse_livraison || '',
        telephone: userData.telephone || '',
      });
    } else {
      navigate('/login');
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

  const handleSubmitOrder = async () => {
    try {
      setSubmitting(true);
      
      const commandeRes = await api.post('panier/vider/');
      const commandeId = commandeRes.data.commande_id;
      
      await api.post('paiements/', {
        commande_id: commandeId,
        montant: panier.total,
        mode_paiement: paiement.mode_paiement,
      });
      
      toast.success('Commande creee avec succes');
      setStep(3);
      
      setTimeout(() => {
        navigate('/commandes');
      }, 3000);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
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
  if (!panier || !panier.lignes || panier.lignes.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Panier vide</h2>
          <button onClick={() => navigate('/catalogue')} className="bg-[#9370DB] text-white px-6 py-2 rounded-lg hover:bg-[#800080] transition">
            Voir le catalogue
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-green-500 text-6xl mb-6">
            <FiCheck className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-[#800080] mb-4">Commande confirmee</h2>
          <p className="text-gray-500 mb-6">
            Votre commande a ete enregistree avec succes.
          </p>
          <p className="text-sm text-gray-500 mt-2">Redirection vers vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiCreditCard />
          <span>Finaliser la commande</span>
        </h1>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-[#9370DB] text-white' : 'bg-gray-300'
            }`}>1</div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-[#9370DB]' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-[#9370DB] text-white' : 'bg-gray-300'
            }`}>2</div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-[#9370DB]' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-[#9370DB] text-white' : 'bg-gray-300'
            }`}>3</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#800080] mb-6 flex items-center gap-2">
                  <FiMapPin />
                  <span>Adresse de livraison</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse complete
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      placeholder="Votre adresse de livraison"
                      value={livraison.adresse_livraison}
                      onChange={(e) => setLivraison({...livraison, adresse_livraison: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiPhone className="inline mr-2" />
                      Telephone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      placeholder="+237 6XX XXX XXX"
                      value={livraison.telephone}
                      onChange={(e) => setLivraison({...livraison, telephone: e.target.value})}
                      required
                    />
                  </div>

                  <button
                    className="w-full bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition"
                    onClick={() => setStep(2)}
                    disabled={!livraison.adresse_livraison || !livraison.telephone}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#800080] mb-6 flex items-center gap-2">
                  <FiCreditCard />
                  <span>Mode de paiement</span>
                </h2>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#9370DB] transition">
                    <input
                      type="radio"
                      name="mode_paiement"
                      value="mobile_money"
                      className="text-[#9370DB] focus:ring-[#9370DB]"
                      checked={paiement.mode_paiement === 'mobile_money'}
                      onChange={(e) => setPaiement({...paiement, mode_paiement: e.target.value})}
                    />
                    <FiSmartphone className="text-2xl text-[#9370DB]" />
                    <div>
                      <div className="font-semibold">Mobile Money</div>
                      <div className="text-sm text-gray-500">MTN Mobile Money, Orange Money</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#9370DB] transition">
                    <input
                      type="radio"
                      name="mode_paiement"
                      value="carte"
                      className="text-[#9370DB] focus:ring-[#9370DB]"
                      checked={paiement.mode_paiement === 'carte'}
                      onChange={(e) => setPaiement({...paiement, mode_paiement: e.target.value})}
                    />
                    <FiCreditCard className="text-2xl text-[#9370DB]" />
                    <div>
                      <div className="font-semibold">Carte bancaire</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#9370DB] transition">
                    <input
                      type="radio"
                      name="mode_paiement"
                      value="especes"
                      className="text-[#9370DB] focus:ring-[#9370DB]"
                      checked={paiement.mode_paiement === 'especes'}
                      onChange={(e) => setPaiement({...paiement, mode_paiement: e.target.value})}
                    />
                    <FiDollarSign className="text-2xl text-[#9370DB]" />
                    <div>
                      <div className="font-semibold">Especes</div>
                      <div className="text-sm text-gray-500">Paiement a la livraison</div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 border border-[#9370DB] text-[#9370DB] font-semibold py-3 rounded-lg hover:bg-[#9370DB] hover:text-white transition"
                    onClick={() => setStep(1)}
                  >
                    Retour
                  </button>
                  <button
                    className="flex-1 bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition"
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                  >
                    {submitting ? 'Traitement...' : 'Confirmer la commande'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-[#800080] mb-4">Ma commande</h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {panier.lignes.map((ligne) => (
                  <div key={ligne.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {getImageUrl(ligne) ? (
                        <img
                          src={getImageUrl(ligne)}
                          alt={ligne.produit_nom}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(ligne.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiImage className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ligne.produit_nom}</p>
                      <p className="text-xs text-gray-500">Qte: {ligne.quantite}</p>
                    </div>
                    <p className="font-semibold text-sm">
                      {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{panier.total?.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#9370DB]">{panier.total?.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;