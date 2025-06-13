// Simple in-memory KV store for development
class DevKV {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// Create a singleton instance
const devKV = new DevKV();

export default devKV; 