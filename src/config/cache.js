import path from 'path';
const storage_path = (rel) => path.resolve(process.cwd(), 'storage', rel);

/* migrated from config/cache.php */

export default {
  // Default Cache Store
  // This option controls the default cache store that will be used by the
  // framework. This connection is utilized if another isn't explicitly
  // specified when running a cache operation inside the application.
  default: process.env.CACHE_DRIVER ?? 'database',

  // Cache Stores
  // Here you may define all of the cache "stores" for your application as
  // well as their drivers. You may even define multiple stores for the
  // same cache driver to group types of items stored in your caches.
  //
  // Supported drivers: "array", "database", "file", "memcached",
  //                    "redis", "dynamodb", "octane", "null"
  stores: {
    array: {
      driver: 'array',
      serialize: false,
    },

    database: {
      driver: 'database',
      connection: process.env.DB_CACHE_CONNECTION,
      table: process.env.DB_CACHE_TABLE ?? 'cache',
      lock_connection: process.env.DB_CACHE_LOCK_CONNECTION,
      lock_table: process.env.DB_CACHE_LOCK_TABLE,
    },

    file: {
      driver: 'file',
      // In Node.js, storage_path would be a configured path. Using an env variable or a sensible default.
      path: process.env.CACHE_FILE_PATH ?? './storage/framework/cache/data',
      lock_path: process.env.CACHE_FILE_LOCK_PATH ?? './storage/framework/cache/data',
    },

    memcached: {
      driver: 'memcached',
      persistent_id: process.env.MEMCACHED_PERSISTENT_ID,
      sasl: [
        process.env.MEMCACHED_USERNAME,
        process.env.MEMCACHED_PASSWORD,
      ],
      options: {
        // In Node.js, Memcached client options would be passed differently.
        // For example: connectTimeout: 2000,
      },
      servers: [
        {
          host: process.env.MEMCACHED_HOST ?? '127.0.0.1',
          port: parseInt(process.env.MEMCACHED_PORT ?? '11211', 10),
          weight: 100,
        },
      ],
    },

    redis: {
      driver: 'redis',
      connection: process.env.REDIS_CACHE_CONNECTION ?? 'cache',
      lock_connection: process.env.REDIS_CACHE_LOCK_CONNECTION ?? 'default',
    },

    dynamodb: {
      driver: 'dynamodb',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
      table: process.env.DYNAMODB_CACHE_TABLE ?? 'cache',
      endpoint: process.env.DYNAMODB_ENDPOINT,
    },

    octane: {
      driver: 'octane', // This is highly Laravel-specific (server persistence), might need a Node.js equivalent or be removed.
    },
  },

  // Cache Key Prefix
  // When utilizing the APC, database, memcached, Redis, and DynamoDB cache
  // stores, there might be other applications using the same cache. For
  // that reason, you may prefix every cache key to avoid collisions.
  prefix: process.env.CACHE_PREFIX ?? (process.env.APP_NAME ? process.env.APP_NAME.toLowerCase().replace(/\s+/g, '-') + '-cache-' : 'laravel-cache-'), '-') + '-cache-',
};
