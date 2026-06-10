import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiPackage,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiSettings
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const raw = localStorage.getItem("user");
  const user = (raw && raw !== "undefined" && raw !== "null") ? JSON.parse(raw) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-[#C084FC]">Tech</span>
            <span className="text-[#9370DB]">Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#9370DB] transition font-medium flex items-center gap-1">
              <FiHome />
              <span>Accueil</span>
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-[#9370DB] transition font-medium flex items-center gap-1">
              <FiGrid />
              <span>Catalogue</span>
            </Link>
            {token && (
              <Link to="/commandes" className="text-gray-700 hover:text-[#9370DB] transition font-medium flex items-center gap-1">
                <FiPackage />
                <span>Mes commandes</span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/panier" className="text-gray-700 hover:text-[#9370DB] transition">
                  <FiShoppingCart className="text-xl" />
                </Link>

                <div className="dropdown dropdown-end">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-[#9370DB] transition">
                    <FiUser className="text-xl" />
                    <span className="text-sm">{user?.nom || 'Compte'}</span>
                  </button>
                  <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-52 mt-2">
                    <li className="px-4 py-2 text-sm font-semibold text-[#9370DB] border-b flex items-center gap-2">
                      <FiUser />
                      {user?.nom}
                    </li>
                    <li>
                      <Link to="/commandes" className="flex items-center gap-2 text-gray-700 hover:text-[#9370DB]">
                        <FiPackage />
                        <span>Mes commandes</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/panier" className="flex items-center gap-2 text-gray-700 hover:text-[#9370DB]">
                        <FiShoppingCart />
                        <span>Mon panier</span>
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <li className="border-t">
                          <Link to="/admin" className="flex items-center gap-2 text-[#9370DB] hover:text-[#800080] font-semibold">
                            <FiSettings />
                            <span>Administration</span>
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="border-t">
                      <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full">
                        <FiLogOut />
                        <span>Deconnexion</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-[#9370DB] transition">
                  <FiLogIn />
                  <span>Connexion</span>
                </Link>
                <Link to="/register" className="bg-[#9370DB] text-white px-4 py-2 rounded-lg hover:bg-[#800080] transition flex items-center gap-1">
                  <FiUserPlus />
                  <span>S'inscrire</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {token && (
              <Link to="/panier" className="text-gray-700">
                <FiShoppingCart className="text-xl" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#9370DB]"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <div className="space-y-2 pt-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHome />
                <span>Accueil</span>
              </Link>
              <Link
                to="/catalogue"
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiGrid />
                <span>Catalogue</span>
              </Link>
              {token ? (
                <>
                  <Link
                    to="/commandes"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiPackage />
                    <span>Mes commandes</span>
                  </Link>
                  <Link
                    to="/panier"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingCart />
                    <span>Mon panier</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-[#9370DB] font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiSettings />
                      <span>Administration</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    <FiLogOut />
                    <span>Deconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#E6E6FA] text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiLogIn />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-[#9370DB] font-semibold hover:bg-[#E6E6FA]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUserPlus />
                    <span>S'inscrire</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;