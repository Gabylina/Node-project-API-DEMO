/* migrated from config/database.php */
export default {
    default: process.env.DB_CONNECTION ?? 'sqlite',

    connections: {
        sqlite: {
            driver: 'sqlite',
            url: process.env.DB_URL,
            database: process.env.DB_DATABASE ?? 'database/database.sqlite', // TODO: Path needs to be resolved relative to Node.js application root, e.g., using `path.join(__dirname, '../../database/database.sqlite')`
            prefix: '',
            foreign_key_constraints: process.env.DB_FOREIGN_KEYS ? (process.env.DB_FOREIGN_KEYS === 'true') : true,
            busy_timeout: null,
            journal_mode: null,
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
            unix_socket: process.env.DB_SOCKET ?? '',
            charset: process.env.DB_CHARSET ?? 'utf8mb4',
            collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
            prefix: '',
            prefix_indexes: true,
            strict: true,
            engine: null,
            options: {
                // PHP PDO options like PDO::MYSQL_ATTR_SSL_CA need to be translated
                // to specific Node.js MySQL driver options (e.g., within an `ssl` object).
                ...(process.env.MYSQL_ATTR_SSL_CA && { SSL_CA: process.env.MYSQL_ATTR_SSL_CA }),
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
            unix_socket: process.env.DB_SOCKET ?? '',
            charset: process.env.DB_CHARSET ?? 'utf8mb4',
            collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
            prefix: '',
            prefix_indexes: true,
            strict: true,
            engine: null,
            options: {
                // PHP PDO options like PDO::MYSQL_ATTR_SSL_CA need to be translated
                // to specific Node.js MariaDB driver options (e.g., within an `ssl` object).
                ...(process.env.MYSQL_ATTR_SSL_CA && { SSL_CA: process.env.MYSQL_ATTR_SSL_CA }),
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
            prefix_indexes: true,
            search_path: 'public',
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
            prefix_indexes: true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'), // TODO: Translate to Node.js driver option (e.g., `options.encrypt`)
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'), // TODO: Translate to Node.js driver option (e.g., `options.trustServerCertificate`)
        },
    },

    migrations: {
        table: 'migrations',
        update_date_on_publish: true,
    },

    redis: {
        client: process.env.REDIS_CLIENT || 'redis', // 'phpredis' is PHP specific, consider 'ioredis' or 'node-redis' for Node.js

        options: {
            cluster: process.env.REDIS_CLUSTER ?? 'redis',
            // The prefix uses Laravel's Str::slug. This is an approximation using built-in JS methods.
            // For precise replication, you might need a dedicated slug utility or a more robust implementation.
            prefix: process.env.REDIS_PREFIX ?? `${(process.env.APP_NAME ?? 'laravel').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-database-`,
            persistent: (process.env.REDIS_PERSISTENT ?? 'false') === 'true',
        },

        default: {
            url: process.env.REDIS_URL,
            host: process.env.REDIS_HOST ?? '127.0.0.1',
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
            database: parseInt(process.env.REDIS_DB ?? '0', 10),
        },

        cache: {
            url: process.env.REDIS_URL,
            host: process.env.REDIS_HOST ?? '127.0.0.1',
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
            database: parseInt(process.env.REDIS_CACHE_DB ?? '1', 10),
        },
    },
};
