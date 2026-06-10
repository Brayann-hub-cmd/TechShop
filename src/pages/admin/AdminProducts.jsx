import { useState, useEffect } from 'react';
import api from '../../api';
import { MEDIA_URL } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSave,
  FiPackage,
  FiSearch,
  FiImage,
  FiUpload
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    categorie: '',
    image: null,
  });

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
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nom: product.nom || '',
        description: product.description || '',
        prix: product.prix || '',
        stock: product.stock || '',
        categorie: product.categorie || '',
        image: null,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        categorie: '',
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      nom: '',
      description: '',
      prix: '',
      stock: '',
      categorie: '',
      image: null,
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('prix', parseFloat(formData.prix));
      formDataToSend.append('stock', parseInt(formData.stock));
      formDataToSend.append('categorie', formData.categorie);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingProduct) {
        await api.put(`produits/${editingProduct.id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produit mis a jour avec succes');
      } else {
        await api.post('produits/', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produit cree avec succes');
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    try {
      await api.delete(`produits/${id}/`);
      toast.success('Produit supprime avec succes');
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleImageError = (produitId) => {
    setImageErrors({ ...imageErrors, [produitId]: true });
  };

  const getImageUrl = (produit) => {
    if (produit.image && !imageErrors[produit.id]) {
      return `${MEDIA_URL}${produit.image}`;
    }
    return null;
  };

  const filteredProduits = produits.filter(produit =>
    produit.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produit.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#800080] flex items-center gap-2">
            <FiPackage />
            <span>Gestion des produits</span>
          </h1>
          <button
            className="bg-[#9370DB] text-white px-6 py-3 rounded-lg hover:bg-[#800080] transition flex items-center gap-2"
            onClick={() => handleOpenModal()}
          >
            <FiPlus />
            <span>Nouveau produit</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-[#E6E6FA]">
                  <th>Produit</th>
                  <th>Categorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduits.map((produit) => (
                  <tr key={produit.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {getImageUrl(produit) ? (
                            <img
                              src={getImageUrl(produit)}
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(produit.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiImage className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{produit.nom}</div>
                          <div className="text-sm opacity-50 truncate max-w-xs">
                            {produit.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{produit.categorie_nom || '-'}</td>
                    <td className="font-semibold">{produit.prix?.toLocaleString()} FCFA</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        produit.stock > 10 ? 'bg-green-100 text-green-800' :
                        produit.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {produit.stock}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1"
                          onClick={() => handleOpenModal(produit)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleDelete(produit.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProduits.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucun produit trouve</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#800080]">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={handleCloseModal}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image du produit
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Apercu"
                          className="w-full h-full object-cover"
                        />
                      ) : editingProduct?.image ? (
                        <img
                          src={`${MEDIA_URL}${editingProduct.image}`}
                          alt={editingProduct.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="text-2xl text-gray-300" />
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                      <FiUpload />
                      <span>Choisir une image</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                    required
                  >
                    <option value="">Selectionner une categorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
                    onClick={handleCloseModal}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition flex items-center justify-center gap-2"
                    disabled={saving}
                  >
                    <FiSave />
                    <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;