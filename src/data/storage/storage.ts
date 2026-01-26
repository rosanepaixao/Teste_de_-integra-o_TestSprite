import {
  CURRENT_SCHEMA_VERSION,
  type DatabaseSchema,
  type DatabaseSchemaV1,
} from "./schema";

const STORAGE_KEY = "time-tracker-db";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const memoryStore = new Map<string, string>();

const memoryStorage: StorageLike = {
  getItem(key) {
    return memoryStore.get(key) ?? null;
  },
  setItem(key, value) {
    memoryStore.set(key, value);
  },
  removeItem(key) {
    memoryStore.delete(key);
  },
};

function resolveStorage(): StorageLike {
  if (typeof window === "undefined") {
    return memoryStorage;
  }

  try {
    if (window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    return memoryStorage;
  }

  return memoryStorage;
}

const storage = resolveStorage();

export function loadDatabase(): DatabaseSchema {
  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    const fresh = createEmptyDatabase();
    saveDatabase(fresh);
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema> & {
      schemaVersion?: number;
    };

    return migrateDatabase(parsed);
  } catch (error) {
    const fresh = createEmptyDatabase();
    saveDatabase(fresh);
    return fresh;
  }
}

export function saveDatabase(database: DatabaseSchema): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(database));
}

function createEmptyDatabase(): DatabaseSchemaV1 {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    projects: [],
    tasks: [],
    timerIntervals: [],
  };
}

function migrateDatabase(
  database: Partial<DatabaseSchema> & { schemaVersion?: number },
): DatabaseSchema {
  const version = database.schemaVersion ?? 0;

  if (version === CURRENT_SCHEMA_VERSION) {
    return normalizeDatabase(database as DatabaseSchemaV1);
  }

  if (version === 0) {
    const migrated: DatabaseSchemaV1 = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      projects: Array.isArray(database.projects) ? database.projects : [],
      tasks: Array.isArray(database.tasks) ? database.tasks : [],
      timerIntervals: Array.isArray(database.timerIntervals)
        ? database.timerIntervals
        : [],
    };

    saveDatabase(migrated);
    return migrated;
  }

  const reset = createEmptyDatabase();
  saveDatabase(reset);
  return reset;
}

function normalizeDatabase(database: DatabaseSchemaV1): DatabaseSchemaV1 {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    projects: Array.isArray(database.projects) ? database.projects : [],
    tasks: Array.isArray(database.tasks) ? database.tasks : [],
    timerIntervals: Array.isArray(database.timerIntervals)
      ? database.timerIntervals
      : [],
  };
}
