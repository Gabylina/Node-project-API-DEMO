/* migrated from config/session.php */
const appName = process.env.APP_NAME ?? 'laravel';
// Simulating Str::slug in JS.
// Converts string to lowercase, replaces non-alphanumeric with hyphens,
// and trims leading/trailing hyphens.
const appNameSlug = appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default {
    driver: process.env.SESSION_DRIVER ?? 'database',
    lifetime: parseInt(process.env.SESSION_LIFETIME ?? '120', 10),
    expire_on_close: process.env.SESSION_EXPIRE_ON_CLOSE === 'true',
    encrypt: process.env.SESSION_ENCRYPT === 'true',
    // Note: original used Laravel's storage_path(). This is a common relative path for file sessions.
    files: './storage/framework/sessions',
    connection: process.env.SESSION_CONNECTION ?? null,
    table: process.env.SESSION_TABLE ?? 'sessions',
    store: process.env.SESSION_STORE ?? null,
    lottery: [2, 100],
    cookie: process.env.SESSION_COOKIE ?? `${appNameSlug}-session`,
    path: process.env.SESSION_PATH ?? '/',
    domain: process.env.SESSION_DOMAIN ?? null,
    secure: process.env.SESSION_SECURE_COOKIE === 'true',
    http_only: (process.env.SESSION_HTTP_ONLY ?? 'true') === 'true',
    same_site: process.env.SESSION_SAME_SITE ?? 'lax',
    partitioned: process.env.SESSION_PARTITIONED_COOKIE === 'true',
};
