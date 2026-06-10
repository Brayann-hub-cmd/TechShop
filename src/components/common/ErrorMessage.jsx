import { FiAlertTriangle } from 'react-icons/fi';

const ErrorMessage = ({ message = 'Une erreur est survenue' }) => {
  return (
    <div className="min-h-screen bg-[#E6E6FA] flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-4">
        <div className="text-red-500 text-center">
          <FiAlertTriangle className="mx-auto text-5xl mb-4" />
          <p className="text-lg font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;