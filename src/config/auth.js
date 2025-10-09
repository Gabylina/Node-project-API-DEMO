/* migrated from config/sanctum.php + config/sanctum.php */

// Helper to extract application host from APP_URL for dynamic domains
const getAppHost = () => {
  try {
    if (process.env.APP_URL) {
      // The .host property will include the port if it's explicitly set and non-standard.
      // E.g., "localhost:3000" for "http://localhost:3000"
      // E.g., "example.com" for "http://example.com" (port 80 is default)
      return new URL(process.env.APP_URL).host;
    }
  } catch (e) {
    // console.warn('Invalid APP_URL environment variable:', process.env.APP_URL, e.message);
  }
  return '';
};

const appHost = getAppHost();

export default {
  // These properties would typically come from config/auth.php.
  // As auth.php was undefined in the input, they are set to common Laravel defaults or empty objects.
  default: 'web',
  guards: {},
  providers: {},
  passwords: {},

  sanctum: {
    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, these should include your local
    | and production domains which access your API via a frontend SPA.
    |
    */
    stateful: (
      process.env.SANCTUM_STATEFUL_DOMAINS ??
      `localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1${appHost}`
    ).split(','),

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. This will override any values set in the token's
    | "expires_at" attribute, but first-party sessions are not affected.
    |
    */
    expiration: null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens in order to take advantage of numerous
    | security scanning initiatives maintained by open source platforms
    | that notify developers if they commit tokens into repositories.
    |
    | See: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
    |
    */
    prefix: process.env.SANCTUM_TOKEN_PREFIX ?? '',
  },
};
