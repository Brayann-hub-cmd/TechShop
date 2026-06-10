import React, { useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from '../../api';
import toast from "react-hot-toast";
import { authApi } from "../../api/api";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login({
        email: email,
        mot_de_passe: password
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        user_id: response.user_id,
        role: response.role,
      }));

      toast.success(`Bienvenue !`);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E6FA] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-[420px]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-[#C084FC]">TechShop</span>
          </h1>
          <p className="text-gray-500 text-sm">Avec nous le digital est a porter de main</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineMail className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                placeholder="........"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#9370DB] bg-gray-100 border-gray-300 rounded focus:ring-[#9370DB]"
              />
              <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-[#800080] hover:text-[#4B0082]">
              Mot de passe oublie ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9370DB] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#800080] transition"
          >
            Se connecter
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
            Vous n'avez pas de compte ?{" "}
            <Link to={'/auth/register'} className="text-[#800080] hover:text-[#4B0082] font-medium">
              Creer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;