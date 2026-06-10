import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiImage } from 'react-icons/fi';
import { MEDIA_URL } from '../../api';

const ProductCard = ({ product }) => {
  const imageUrl = product.image 
    ? `${MEDIA_URL}${product.image}` 
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nom}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
              const icon = document.createElement('div');
              icon.innerHTML = '<svg>...</svg>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiImage className="text-4xl text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.nom}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#9370DB]">
            {product.prix?.toLocaleString()} FCFA
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/produits/${product.id}`}
            className="flex-1 text-center border border-[#9370DB] text-[#9370DB] py-2 rounded-lg hover:bg-[#9370DB] hover:text-white transition text-sm flex items-center justify-center gap-1"
          >
            <FiEye />
            <span>Details</span>
          </Link>
          <button
            className="flex-1 bg-[#9370DB] text-white py-2 rounded-lg hover:bg-[#800080] transition text-sm flex items-center justify-center gap-1"
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;