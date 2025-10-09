/* migrated from config/database.php */
export default {
  default: process.env.DB_CONNECTION ?? 'sqlite',

  connections: {
    sqlite: {
      driver: 'sqlite',
      url: process.env.DB_URL,
      database: process.env.DB_DATABASE ?? 'database/database.sqlite',
      prefix: '',
      foreignKeyConstraints: (process.env.DB_FOREIGN_KEYS ?? 'true') === 'true',
      busyTimeout: null,
      journalMode: null,
      synchronous: null,
    },

    mysql: {
      driver: 'mysql',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      unixSocket: process.env.DB_SOCKET ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8mb4',
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
      prefix: '',
      prefixIndexes: true,
      strict: true,
      engine: null,
      options: {
        ...(process.env.MYSQL_ATTR_SSL_CA ? { sslCa: process.env.MYSQL_ATTR_SSL_CA } : {}),
      },
    },

    mariadb: {
      driver: 'mariadb',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      unixSocket: process.env.DB_SOCKET ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8mb4',
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
      prefix: '',
      prefixIndexes: true,
      strict: true,
      engine: null,
      options: {
        ...(process.env.MYSQL_ATTR_SSL_CA ? { sslCa: process.env.MYSQL_ATTR_SSL_CA } : {}),
      },
    },

    pgsql: {
      driver: 'pgsql',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8',
      prefix: '',
      prefixIndexes: true,
      searchPath: 'public',
      sslmode: 'prefer',
    },

    sqlsrv: {
      driver: 'sqlsrv',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '1433', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8',
      prefix: '',
      prefixIndexes: true,
    },
  },

  migrations: {
    table: 'migrations',
    updateDateOnPublish: true,
  },

  redis: {
    client: process.env.REDIS_CLIENT || 'redis',

    options: {
      cluster: process.env.REDIS_CLUSTER ?? 'redis',
      // Str::slug((string) env('APP_NAME', 'laravel'))
      prefix: process.env.REDIS_PREFIX ?? ((process.env.APP_NAME ?? 'laravel').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-database-'),
      persistent: (process.env.REDIS_PERSISTENT ?? 'false') === 'true',
    },

    default: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      username: process.env.REDIS_USERNAME ?? null,
      password: process.env.REDIS_PASSWORD ?? null,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      database: parseInt(process.env.REDIS_DB ?? '0', 10),
    },

    cache: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      username: process.env.REDIS_USERNAME ?? null,
      password: process.env.REDIS_PASSWORD ?? null,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      database: parseInt(process.env.REDIS_CACHE_DB ?? '1', 10),
    },
  },
};
