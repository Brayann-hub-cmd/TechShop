import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-[#C084FC]">Tech</span>
              <span className="text-[#9370DB]">Shop</span>
            </h3>
            <p className="text-gray-500 text-sm">
              Avec nous le digital est a portee de main
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#800080]">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#9370DB] text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-gray-500 hover:text-[#9370DB] text-sm">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-[#9370DB] text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#800080]">Service client</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <FiPhone />
                <span>+237 691 333 780</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail />
                <span>support@techshop.cm</span>
              </li>
              <li className="flex items-center gap-2">
                <FiClock />
                <span>Lun-Sam: 8h-20h</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#800080]">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-[#9370DB] text-xl">
                <FiFacebook />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#9370DB] text-xl">
                <FiTwitter />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#9370DB] text-xl">
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>2026 TechShop - Tous droits reserves</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;