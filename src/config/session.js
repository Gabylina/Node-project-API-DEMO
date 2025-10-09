import path from 'path';
/* migrated from config/session.php */

export default {
    driver: process.env.SESSION_DRIVER ?? 'database',

    lifetime: parseInt(process.env.SESSION_LIFETIME ?? '120', 10),

    expire_on_close: process.env.SESSION_EXPIRE_ON_CLOSE === 'true',

    encrypt: process.env.SESSION_ENCRYPT === 'true',

    // When utilizing the "file" session driver, the session files are placed
    // on disk. The original PHP used `storage_path()`. In Node.js, you might
    // define this path using an environment variable or a statically defined path.
    files: process.env.SESSION_FILES_PATH ?? 'storage/framework/sessions',

    store: process.env.SESSION_STORE ?? null,

    cookie: process.env.SESSION_COOKIE ??
        (((process.env.APP_NAME ?? 'laravel')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'app') + '-session'),

    path: process.env.SESSION_PATH ?? '/',

    domain: process.env.SESSION_DOMAIN ?? null,

    secure: process.env.SESSION_SECURE_COOKIE === 'true',

    http_only: !(process.env.SESSION_HTTP_ONLY === 'false'),

    same_site: process.env.SESSION_SAME_SITE ?? 'lax'
};
