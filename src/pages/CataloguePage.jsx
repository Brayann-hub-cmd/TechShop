import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiSearch, FiFilter } from 'react-icons/fi';

const CataloguePage = () => {
  const [searchParams] = useSearchParams();
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState(searchParams.get('categorie') || '');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProduits();
  }, [selectedCategorie, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories/');
      setCategories(response.data.results || response.data);
    } catch (err) {
      console.error('Erreur chargement categories:', err);
    }
  };

  const fetchProduits = async () => {
    try {
      setLoading(true);
      let url = 'produits/';
      const params = [];
      
      if (selectedCategorie) params.push(`categorie=${selectedCategorie}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const response = await api.get(url);
      let data = response.data.results || response.data;
      
      if (sortBy === 'prix_asc') data.sort((a, b) => a.prix - b.prix);
      else if (sortBy === 'prix_desc') data.sort((a, b) => b.prix - a.prix);
      else if (sortBy === 'nom') data.sort((a, b) => a.nom.localeCompare(b.nom));
      
      setProduits(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le catalogue');
    } finally {
      setLoading(false);
    }
  };

  const filteredProduits = produits.filter((produit) => {
    return searchTerm
      ? produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiFilter />
          <span>Catalogue</span>
        </h1>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#9370DB] focus:border-[#9370DB]"
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
            >
              <option value="">Toutes les categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#9370DB] focus:border-[#9370DB]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Trier par...</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix decroissant</option>
              <option value="nom">Nom</option>
            </select>
          </div>
        </div>

        {/* Resultats */}
        <p className="text-gray-500 mb-4">{filteredProduits.length} produit(s) trouve(s)</p>

        {filteredProduits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduits.map((produit) => (
              <ProductCard key={produit.id} product={produit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-gray-400">Aucun produit trouve</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos criteres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CataloguePage;