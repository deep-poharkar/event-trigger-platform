import React from 'react';
import { Play, Trash2 } from 'lucide-react';
import { Trigger } from '../types';

interface TriggerListProps {
  triggers: Trigger[];
  onTest: (triggerId: string) => void;
  onDelete: (triggerId: string) => void;
  isLoading: boolean;
}

export function TriggerList({ triggers, onTest, onDelete, isLoading }: TriggerListProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (triggers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No triggers created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <div
          key={trigger.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{trigger.name}</h3>
              <p className="text-sm text-gray-500">
                {trigger.type === 'scheduled' ? trigger.schedule : trigger.endpoint}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onTest(trigger.id)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                title="Test Trigger"
              >
                <Play className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (trigger.id) {
                    onDelete(trigger.id.toString())
                  }
                }}
                className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Delete Trigger"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}