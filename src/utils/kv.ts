import { KVNamespace } from '@cloudflare/workers-types';

// Development KV store using Cloudflare's API
class CloudflareKV {
  private accountId: string;
  private apiToken: string;
  private namespaceId: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
    this.namespaceId = process.env.NEXT_PUBLIC_DEV_KV_ID || '';
    
    // Debug logging
    console.log('KV Configuration:', {
      accountId: this.accountId ? 'Set' : 'Not Set',
      apiToken: this.apiToken ? 'Set' : 'Not Set',
      namespaceId: this.namespaceId ? 'Set' : 'Not Set'
    });
  }

  private async request(path: string, options: RequestInit = {}) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}${path}`;
    
    // Debug logging
    console.log('KV Request:', {
      url,
      method: options.method || 'GET',
      path
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    if (!response.ok) {
      console.error('KV API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      throw new Error(`KV API error: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  }

  async get(key: string): Promise<string | null> {
    try {
      console.log('Attempting to get KV value for key:', key);
      const response = await this.request(`/values/${encodeURIComponent(key)}`);
      console.log('KV get response:', response);
      return response || null;
    } catch (error) {
      console.error('Error getting KV value:', error);
      return null;
    }
  }

  async put(key: string, value: string): Promise<void> {
    try {
      console.log('Attempting to put KV value for key:', key);
      const response = await this.request(`/values/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: value,
      });
      console.log('KV put response:', response);
      
      if (!response.success) {
        throw new Error(`KV put operation failed: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Error putting KV value:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.request(`/values/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting KV value:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const devKV = new CloudflareKV(); 