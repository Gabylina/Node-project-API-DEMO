/* migrated from database/factories/UserFactory.php */

/**
 * @class UserFactory
 * @description Factory for creating User data objects.
 */
export class UserFactory {
  /**
   * Defines the model's default state.
   * Equivalent to the `definition()` method in Laravel factories.
   * @param {object} [deps={}] - Dependencies like repositories or configuration.
   * @returns {object} An object with default data for a User.
   */
  static definition(deps = {}) {
    // In Laravel, `static::$password` caches the password. Here, we provide a placeholder
    // and a TODO for actual hashing logic.
    // `Hash::make('password')` would be the equivalent of a password hashing function.
    const defaultHashedPassword = 'hashed_password_placeholder'; // Example placeholder

    return {
      name: 'John Doe', // TODO: integrar Faker de Node (p.ej. @faker-js/faker). Original: fake()->name()
      email: 'john.doe@example.com', // TODO: integrar Faker de Node (p.ej. @faker-js/faker). Original: fake()->unique()->safeEmail()
      email_verified_at: new Date().toISOString(), // Original: now(). Using ISO string for standard datetime representation.
      password: defaultHashedPassword, // TODO: integrar bcrypt o Argon2 para hashing. Por defecto, generaría un hash de 'password'.
      remember_token: 'random_token_placeholder', // TODO: generar una cadena aleatoria de 10 caracteres. Original: Str::random(10)
    };
  }

  /**
   * Creates a plain object representing a User with optional overrides.
   * This method mimics Laravel's factory `make()` method.
   * @param {object} [overrides={}] - Specific fields to override the default definition.
   * @param {object} [deps={}] - Dependencies.
   * @returns {object} A user data object.
   */
  static make(overrides = {}, deps = {}) {
    return {
      ...this.definition(deps),
      ...overrides,
    };
  }

  /**
   * Creates and potentially persists a User record.
   * This method mimics Laravel's factory `create()` method.
   * @param {object} [overrides={}] - Specific fields to override.
   * @param {object} [deps={}] - Dependencies, e.g., a user repository.
   * @returns {Promise<object>} The created user record.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    // TODO: inyectar repos en deps y crear registros relacionados si aplica (ninguno explícito en este factory PHP).
    return record;
  }
}
