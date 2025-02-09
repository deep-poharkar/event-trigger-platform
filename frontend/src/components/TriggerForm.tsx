import React from 'react';
import { Clock, Globe } from 'lucide-react';
import { TriggerType } from '../types';

interface TriggerFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function TriggerForm({ onSubmit, isLoading }: TriggerFormProps) {
  const [type, setType] = React.useState<TriggerType>('scheduled');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('scheduled')}
            className={`flex items-center justify-center p-4 rounded-lg border ${
              type === 'scheduled'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Clock className="mr-2 h-5 w-5" />
            Scheduled
          </button>
          <button
            type="button"
            onClick={() => setType('api')}
            className={`flex items-center justify-center p-4 rounded-lg border ${
              type === 'api'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Globe className="mr-2 h-5 w-5" />
            API
          </button>
        </div>
      </div>

      <input type="hidden" name="type" value={type} />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Trigger Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter trigger name"
        />
      </div>

      {type === 'scheduled' ? (
        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (Cron Expression)
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="*/5 * * * *"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-2">
            API Endpoint
          </label>
          <input
            type="url"
            id="endpoint"
            name="endpoint"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://api.example.com/webhook"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating...' : 'Create Trigger'}
      </button>
    </form>
  );
}