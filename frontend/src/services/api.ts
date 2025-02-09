import { Trigger, EventLog } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }
  return response.json();
}

export const api = {
  // Trigger endpoints
  async createTrigger(data: FormData): Promise<Trigger> {
    const response = await fetch(`${API_BASE_URL}/triggers`, {
      method: 'POST',
      body: JSON.stringify({
        type: data.get('type'),
        name: data.get('name'),
        schedule: data.get('type') === 'scheduled' ? data.get('schedule') : undefined,
        endpoint: data.get('type') === 'api' ? data.get('endpoint') : undefined,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return handleResponse<Trigger>(response);
  },

  async listTriggers(): Promise<Trigger[]> {
    const response = await fetch(`${API_BASE_URL}/triggers`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<Trigger[]>(response);
  },

  async testTrigger(triggerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/triggers/${triggerId}/execute`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<void>(response);
  },

  async deleteTrigger(triggerId: string): Promise<void> {
    if (!triggerId || triggerId === 'undefined') {
        throw new Error('Invalid trigger ID');
    }
    const response = await fetch(`${API_BASE_URL}/triggers/${triggerId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse<void>(response);
  },

  // Event log endpoints
  async listLogs(params: { archived?: boolean } = {}): Promise<EventLog[]> {
    const searchParams = new URLSearchParams();
    if (params.archived) {
      searchParams.append('archived', 'true');
    }
    // Add a time range filter for the last 2 hours by default
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    searchParams.append('start_time', twoHoursAgo);
    
    const response = await fetch(`${API_BASE_URL}/events?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<EventLog[]>(response);
  },
};