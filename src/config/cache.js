import path from 'path';
const storage_path = (rel) => path.resolve(process.cwd(), 'storage', rel);

/* migrated from config/cache.php */

export default {
    default: process.env.CACHE_DRIVER ?? 'database',

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
            // En Laravel, storage_path() resuelve una ruta absoluta. 
            // Esto es un placeholder; ajústalo a la ruta de almacenamiento de tu aplicación Node.js.
            path: 'framework/cache/data',
            lock_path: 'framework/cache/data',
        },

        memcached: {
            driver: 'memcached',
            persistent_id: process.env.MEMCACHED_PERSISTENT_ID,
            sasl: [
                process.env.MEMCACHED_USERNAME,
                process.env.MEMCACHED_PASSWORD,
            ],
            options: {
                // La opción `Memcached::OPT_CONNECT_TIMEOUT` en PHP no tiene un equivalente directo aquí; 
                // estas opciones son específicas del driver de Memcached en PHP.
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
            driver: 'octane',
        },
    },

    // El 'prefix' en Laravel utiliza `Str::slug` para generar un string amigable. 
    // Aquí se ha traducido a una concatenación básica. Si se requiere un comportamiento 
    // de 'slugging' idéntico, se deberá implementar con una utilidad de Node.js.
    prefix: process.env.CACHE_PREFIX ?? (process.env.APP_NAME ? process.env.APP_NAME.toLowerCase().replace(/\s+/g, '-') + '-cache-' : 'laravel-cache-'),
};
