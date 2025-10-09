/* migrated from config/sanctum.php + config/sanctum.php */
export default {
  sanctum: {
    stateful: (
      process.env.SANCTUM_STATEFUL_DOMAINS ||
      'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1' /* + Sanctum::currentApplicationUrlWithPort() */
    ).split(','),
    expiration: null,
    prefix: process.env.SANCTUM_TOKEN_PREFIX || '',
  },
};
