import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 my-4 rounded shadow-sm">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Disclaimer: Neutral Reporting Platform</p>
          <p>
            AutoReport LB does <strong>not</strong> verify the accuracy of reported events. 
            All data is displayed "as is" from the reporting entity (Insurance Companies, etc.). 
            We do not declare vehicle condition or assign fault. AI summaries are automatically generated and may vary.
            Always conduct a professional inspection before purchasing a used vehicle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
