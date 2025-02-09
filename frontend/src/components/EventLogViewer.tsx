import React from 'react';
import { Archive, RefreshCw } from 'lucide-react';
import { EventLog } from '../types';

interface EventLogViewerProps {
  logs: EventLog[];
  isLoading: boolean;
  showArchived: boolean;
  onToggleArchived: () => void;
  onRefresh: () => void;
}

export function EventLogViewer({
  logs,
  isLoading,
  showArchived,
  onToggleArchived,
  onRefresh,
}: EventLogViewerProps) {
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  React.useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(onRefresh, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleArchived}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
              showArchived
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Archive className="h-4 w-4" />
            <span>{showArchived ? 'Showing Archived' : 'Show Archived'}</span>
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
              autoRefresh
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}</span>
          </button>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trigger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.triggerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.executionTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.type === 'api' ? (
                      <pre className="text-xs">{JSON.stringify(log.payload, null, 2)}</pre>
                    ) : (
                      log.schedule
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}