import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { AlertCircle, CheckCircle, FileText, Info } from 'lucide-react';

const Timeline = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/events/vehicle/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Vehicle not found or no events reported yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading vehicle history...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
      <Link to="/" className="text-blue-600 underline">Search again</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 mb-4 inline-block">&larr; Back to Search</Link>
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {data.vehicle.make} {data.vehicle.model} ({data.vehicle.year})
        </h1>
        <div className="flex gap-4 text-sm text-slate-600">
          <span className="bg-slate-100 px-3 py-1 rounded">VIN: {data.vehicle.vin || 'N/A'}</span>
          <span className="bg-slate-100 px-3 py-1 rounded">Plate: {data.vehicle.plateNumber || 'N/A'}</span>
        </div>
      </div>

      <DisclaimerBanner />

      {/* AI Summary */}
      {data.aiSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-8 relative">
          <div className="absolute top-4 right-4 text-xs text-blue-400 border border-blue-200 px-2 py-0.5 rounded">
            AI Generated • {data.aiSummary.modelUsed}
          </div>
          <h2 className="flex items-center text-lg font-bold text-blue-900 mb-3">
            <Info className="h-5 w-5 mr-2" />
            AI Neutral Summary
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            {data.aiSummary.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.aiSummary.tags.map((tag, idx) => (
              <span key={idx} className="bg-white text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Events Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {data.events.map((event) => (
          <div key={event._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-200 group-hover:bg-blue-500 transition shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <FileText className="h-5 w-5 text-slate-600 group-hover:text-white" />
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-sm">{event.eventType.replace('_', ' ')}</span>
                <span className="text-xs text-slate-500">{new Date(event.dateOccurred).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-600 text-sm mb-3">
                "{event.description}"
              </p>
              <div className="border-t pt-2 mt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Reported by: <span className="font-semibold text-slate-600">{event.reporterId.companyName || 'Unknown'}</span></span>
                {event.isVerifiedByAdmin && <CheckCircle className="h-4 w-4 text-green-500" title="Verified Reporter" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {data.events.length === 0 && (
         <div className="text-center py-10 text-slate-500">No events reported for this vehicle yet.</div>
      )}
    </div>
  );
};

export default Timeline;
