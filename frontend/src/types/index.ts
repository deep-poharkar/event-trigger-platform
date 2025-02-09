export type TriggerType = 'scheduled' | 'api';

export interface Trigger {
  id: string;
  type: TriggerType;
  name: string;
  schedule?: string;
  endpoint?: string;
  createdAt: string;
}

export interface EventLog {
  id: string;
  triggerId: string;
  triggerName: string;
  executionTime: string;
  status: 'success' | 'failed' | 'pending';
  type: TriggerType;
  payload?: Record<string, unknown>;
  schedule?: string;
}