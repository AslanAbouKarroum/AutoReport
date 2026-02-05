import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/vehicle/${query.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-6">
          Check Vehicle History
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Neutral, transparent transparency for Lebanese vehicles.
        </p>

        <form onSubmit={handleSearch} className="relative w-full mb-12">
          <input
            type="text"
            placeholder="Enter VIN or Plate Number (e.g., B 123456)"
            className="w-full p-4 pl-12 rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Search
          </button>
        </form>

        <DisclaimerBanner />
      </div>
    </div>
  );
};

export default Home;
