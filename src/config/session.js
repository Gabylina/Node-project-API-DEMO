/* migrated from config/session.php */
export default {
  driver: process.env.SESSION_DRIVER ?? 'database',
  lifetime: parseInt(process.env.SESSION_LIFETIME ?? '120', 10),
  encrypt: process.env.SESSION_ENCRYPT === 'true',
  files: './storage/framework/sessions',
  store: process.env.SESSION_STORE ?? null,
  cookie: process.env.SESSION_COOKIE ?? 'laravel-session',
  path: process.env.SESSION_PATH ?? '/',
  domain: process.env.SESSION_DOMAIN ?? null,
  secure: process.env.SESSION_SECURE_COOKIE === 'true',
  http_only: (process.env.SESSION_HTTP_ONLY ?? 'true') === 'true',
  same_site: process.env.SESSION_SAME_SITE ?? 'lax',
};
