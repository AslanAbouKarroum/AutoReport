import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    vin: '',
    plateNumber: '',
    eventType: 'accident',
    dateOccurred: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    if (!formData.vin && !formData.plateNumber) {
        setMessage({ type: 'error', text: 'Please provide either VIN or Plate Number' });
        setLoading(false);
        return;
    }

    try {
      await api.post('/events', formData);
      setMessage({ type: 'success', text: 'Event reported successfully. It is now permanent.' });
      setFormData({ vin: '', plateNumber: '', eventType: 'accident', dateOccurred: '', description: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to report event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Partner Dashboard</h1>
        <p className="text-slate-600">Logged in as: <span className="font-semibold">{user.companyName}</span></p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b">
          <h2 className="font-bold text-lg text-slate-700">Submit New Vehicle Report</h2>
          <p className="text-xs text-slate-500 mt-1">
            WARNING: All submissions are immutable (cannot be changed or deleted). 
            Please verify all details before submitting.
          </p>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`p-4 rounded mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">VIN (Chassis Number)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                value={formData.vin}
                onChange={(e) => setFormData({...formData, vin: e.target.value})}
                placeholder="ABC12345..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number (Lebanon)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                value={formData.plateNumber}
                onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                placeholder="B 123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
              <select 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.eventType}
                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
              >
                <option value="accident">Accident</option>
                <option value="claim">Insurance Claim</option>
                <option value="theft">Theft</option>
                <option value="import">Import Record</option>
                <option value="total_loss">Total Loss</option>
                <option value="registration_transfer">Registration Transfer</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Occurred</label>
              <input 
                type="date" 
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dateOccurred}
                onChange={(e) => setFormData({...formData, dateOccurred: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Original Text)</label>
              <textarea 
                required
                rows="4"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the event in detail. This text will be displayed publicly exactly as written."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded text-white font-bold transition ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
