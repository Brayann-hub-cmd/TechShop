import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiTag } from 'react-icons/fi';

const HomePage = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [produitsRes, categoriesRes] = await Promise.all([
        api.get('produits/'),
        api.get('categories/'),
      ]);
      
      setProduits(produitsRes.data.results || produitsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les donnees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#9370DB] to-[#800080] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" data-aos="fade-in">
            Bienvenue sur <span className="text-[#C084FC]">TechShop</span>
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Avec nous le digital est a portee de main
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/catalogue"
              className="bg-white text-[#9370DB] px-8 py-3 rounded-lg font-semibold hover:bg-[#E6E6FA] transition flex items-center gap-2"
            >
              <span>Voir le catalogue</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiTruck className="text-4xl text-[#9370DB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-gray-500">Livraison en 24-48h partout au Cameroun</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiShield className="text-4xl text-[#9370DB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Paiement Securise</h3>
            <p className="text-gray-500">Mobile Money, Carte Bancaire, Especes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiHeadphones className="text-4xl text-[#9370DB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
            <p className="text-gray-500">Une equipe a votre ecoute</p>
          </div>
        </div>
      </div>

      {/* Produits en vedette */}
      <div className="container mx-auto px-4 py-16" data-aos="fade-up">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#800080] flex items-center gap-2">
            <FiTag />
            <span>Produits en vedette</span>
          </h2>
          <Link
            to="/catalogue"
            className="border border-[#9370DB] text-[#9370DB] px-6 py-2 rounded-lg hover:bg-[#9370DB] hover:text-white transition flex items-center gap-2"
          >
            <span>Voir tout</span>
            <FiArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produits.slice(0, 8).map((produit) => (
            <ProductCard key={produit.id} product={produit} />
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#800080]">
              Nos Categories
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((categorie) => (
                <Link
                  key={categorie.id}
                  to={`/catalogue?categorie=${categorie.id}`}
                  className="bg-[#E6E6FA] rounded-lg p-6 text-center hover:shadow-lg transition-shadow hover:bg-[#9370DB] hover:text-white group"
                >
                  <h3 className="font-semibold text-lg group-hover:text-white">{categorie.nom}</h3>
                  {categorie.description && (
                    <p className="text-sm mt-2 group-hover:text-white opacity-70">{categorie.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banniere promo */}
      <div className="container mx-auto px-4 py-16" data-aos="zoom-in">
        <div className="bg-gradient-to-r from-[#C084FC] to-[#9370DB] rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Offre speciale : -20% sur tous les smartphones !
          </h3>
          <p className="mb-4">Avec le code PROMO20</p>
          <Link
            to="/catalogue"
            className="inline-block bg-white text-[#9370DB] px-6 py-2 rounded-lg font-semibold hover:bg-[#E6E6FA] transition"
          >
            En profiter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;