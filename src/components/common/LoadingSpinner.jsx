import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#E6E6FA] flex justify-center items-center">
      <ClipLoader size={50} color="#9370DB" />
    </div>
  );
};

export default LoadingSpinner;