import React, { useState } from "react";
import { AiOutlineLock, AiOutlinePhone, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from '../../api';
import toast from "react-hot-toast";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    telephone: '',
    adresse_livraison: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/register/', formData);
      toast.success('Inscription reussie ! Connectez-vous maintenant.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      if (error.response?.data) {
        const messages = Object.values(error.response.data).flat();
        messages.forEach(msg => toast.error(msg));
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-md p-8 w-[460px]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-[#C084FC]">TechShop</span>
          </h1>
          <p className="text-gray-500 text-sm">Creez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                placeholder="Votre nom complet"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineMail className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                placeholder="........"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telephone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlinePhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiMapPin className="inline mr-1" />
              Adresse de livraison
            </label>
            <textarea
              name="adresse_livraison"
              value={formData.adresse_livraison}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
              placeholder="Votre adresse complete"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9370DB] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#800080] transition"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Vous avez deja un compte ?{" "}
            <Link to={'/login'} className="text-[#800080] hover:text-[#4B0082] font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;