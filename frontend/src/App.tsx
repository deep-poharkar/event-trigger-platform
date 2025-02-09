import React from 'react';
import { TriggerForm } from './components/TriggerForm';
import { TriggerList } from './components/TriggerList';
import { EventLogViewer } from './components/EventLogViewer';
import { Trigger, EventLog } from './types';
import { Zap } from 'lucide-react';
import { api } from './services/api';

function App() {
  const [triggers, setTriggers] = React.useState<Trigger[]>([]);
  const [logs, setLogs] = React.useState<EventLog[]>([]);
  const [showArchived, setShowArchived] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch initial data
  React.useEffect(() => {
    fetchTriggers();
    fetchLogs();
  }, []);

  const fetchTriggers = async () => {
    try {
      const data = await api.listTriggers();
      setTriggers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch triggers');
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await api.listLogs({ archived: showArchived });
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    }
  };

  const handleCreateTrigger = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.createTrigger(formData);
      await fetchTriggers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trigger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestTrigger = async (triggerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.testTrigger(triggerId);
      await fetchLogs(); // Refresh logs to show test result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test trigger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrigger = async (triggerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.deleteTrigger(triggerId);
      await fetchTriggers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trigger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh logs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Event Trigger Platform</h1>
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create Trigger</h2>
              <TriggerForm onSubmit={handleCreateTrigger} isLoading={isLoading} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Active Triggers</h2>
              <TriggerList
                triggers={triggers}
                onTest={handleTestTrigger}
                onDelete={handleDeleteTrigger}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Logs</h2>
            <EventLogViewer
              logs={logs}
              isLoading={isLoading}
              showArchived={showArchived}
              onToggleArchived={() => {
                setShowArchived(!showArchived);
                fetchLogs();
              }}
              onRefresh={handleRefreshLogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;