interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  DIGIPIN_KV: KVNamespace;
}

declare global {
  var env: Env;
}

export {}; 