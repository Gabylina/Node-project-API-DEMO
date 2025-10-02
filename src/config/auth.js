/* migrated from config/sanctum.php + config/sanctum.php */
export default {
  // The 'default', 'guards', 'providers', and 'passwords' keys typically come from config/auth.php.
  // Since config/auth.php was undefined in the input, placeholder values are used here to match the expected structure for src/config/auth.js.
  default: 'web',
  guards: {},
  providers: {},
  passwords: {},

  sanctum: {
    stateful: (process.env.SANCTUM_STATEFUL_DOMAINS || 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1').split(','),

    // In Laravel, the default for 'stateful' also includes a dynamic call to `Sanctum::currentApplicationUrlWithPort()`.
    // This dynamic behavior cannot be directly translated into a static Node.js configuration file.
    // Only the hardcoded domains part of the default value has been included.

    expiration: null,

    prefix: process.env.SANCTUM_TOKEN_PREFIX || '',
  },
};
