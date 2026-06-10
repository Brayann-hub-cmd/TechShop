import { useState } from 'react';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiSend,
  FiUser,
  FiMessageSquare
} from 'react-icons/fi';
import { AiOutlineMail } from 'react-icons/ai';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulation d'envoi (a connecter a ton backend si besoin)
    setTimeout(() => {
      toast.success('Message envoye avec succes !');
      setFormData({
        nom: '',
        email: '',
        sujet: '',
        message: '',
      });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="bg-[#E6E6FA] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#800080] mb-8 flex items-center gap-2">
          <FiMessageSquare />
          <span>Contactez-nous</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#800080] mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiUser className="inline mr-1" />
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      placeholder="Votre nom"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <AiOutlineMail className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                    placeholder="Sujet de votre message"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#9370DB] focus:border-[#9370DB]"
                    placeholder="Votre message..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#9370DB] text-white font-semibold py-3 rounded-lg hover:bg-[#800080] transition flex items-center justify-center gap-2"
                  disabled={sending}
                >
                  <FiSend />
                  <span>{sending ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-[#800080] mb-6">
                Nos coordonnees
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E6E6FA] p-3 rounded-lg">
                    <FiPhone className="text-2xl text-[#9370DB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telephone</h3>
                    <p className="text-gray-500">+237 6XX XXX XXX</p>
                    <p className="text-gray-500">+237 6XX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6E6FA] p-3 rounded-lg">
                    <FiMail className="text-2xl text-[#9370DB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-500">support@techshop.cm</p>
                    <p className="text-gray-500">contact@techshop.cm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6E6FA] p-3 rounded-lg">
                    <FiMapPin className="text-2xl text-[#9370DB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Adresse</h3>
                    <p className="text-gray-500">Douala, Cameroun</p>
                    <p className="text-gray-500">Rue de la Reunification</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E6E6FA] p-3 rounded-lg">
                    <FiClock className="text-2xl text-[#9370DB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Heures d'ouverture</h3>
                    <p className="text-gray-500">Lundi - Vendredi: 8h - 20h</p>
                    <p className="text-gray-500">Samedi: 9h - 18h</p>
                    <p className="text-gray-500">Dimanche: Ferme</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#E6E6FA] rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Notre equipe vous repond dans les plus brefs delais, generalement sous 24h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;