/* migrated from config/sanctum.php + config/sanctum.php */

const getAppHostWithPort = () => {
  if (process.env.APP_URL) {
    try {
      const url = new URL(process.env.APP_URL);
      return url.host;
    } catch (e) {
      console.warn('Invalid APP_URL environment variable for Sanctum stateful domains:', process.env.APP_URL, e);
    }
  }
  return '';
};

export default {
  sanctum: {
    stateful: process.env.SANCTUM_STATEFUL_DOMAINS?.split(',') || (
      'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1' + getAppHostWithPort()
    ).split(','),
    guard: ['web'],
    expiration: null,
    token_prefix: process.env.SANCTUM_TOKEN_PREFIX || '',
    middleware: {
      authenticate_session: 'Laravel\Sanctum\Http\Middleware\AuthenticateSession',
      encrypt_cookies: 'Illuminate\Cookie\Middleware\EncryptCookies',
      validate_csrf_token: 'Illuminate\Foundation\Http\Middleware\ValidateCsrfToken',
    },
  },
};
