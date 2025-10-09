/* migrated from config/session.php */
export default {
    driver: process.env.SESSION_DRIVER ?? 'database',

    lifetime: parseInt(process.env.SESSION_LIFETIME ?? '120', 10),

    encrypt: process.env.SESSION_ENCRYPT === 'true',

    files: './storage/framework/sessions',

    store: process.env.SESSION_STORE,

    cookie: process.env.SESSION_COOKIE ?? 'laravel-session',

    path: process.env.SESSION_PATH ?? '/',

    domain: process.env.SESSION_DOMAIN,

    secure: process.env.SESSION_SECURE_COOKIE === 'true',

    http_only: process.env.SESSION_HTTP_ONLY !== 'false',

    same_site: process.env.SESSION_SAME_SITE ?? 'lax'
};
