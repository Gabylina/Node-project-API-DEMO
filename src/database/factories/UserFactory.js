/* migrated from database/factories/UserFactory.php */

/**
 * UserFactory
 *
 * Migrated from Laravel's UserFactory.
 * Provides default data, making, and creating functionality for user records.
 */
export class UserFactory {
  /**
   * Defines the model's default state.
   *
   * @param {object} deps - Optional dependencies like configuration or helper functions.
   * @returns {object} An object with default user data.
   */
  static definition(deps = {}) {
    // PHP's fake()->name()
    const name = 'John Doe'; // TODO: integrar Faker de Node (p.ej. @faker-js/faker)

    // PHP's fake()->unique()->safeEmail()
    const email = 'john.doe@example.com'; // TODO: integrar Faker de Node (p.ej. @faker-js/faker)

    // PHP's now()
    const emailVerifiedAt = new Date().toISOString();

    // PHP's static::$password ??= Hash::make('password')
    // The PHP definition returns a hashed password. We use a placeholder here.
    const password = 'hashed-default-password'; // TODO: generar un hash seguro (p.ej. bcrypt) si se usa directamente, o proporcionar un valor ya hasheado.

    // PHP's Str::random(10)
    const rememberToken = 'randomStringPlaceholder'; // TODO: generar un token aleatorio (p.ej. crypto.randomBytes(5).toString('hex'))

    return {
      name,
      email,
      email_verified_at: emailVerifiedAt,
      password,
      remember_token: rememberToken,
    };
  }

  /**
   * Creates a user data object with default values and applies overrides.
   *
   * @param {object} overrides - Properties to override the default definition.
   * @param {object} deps - Optional dependencies.
   * @returns {object} A plain object representing a user record.
   */
  static make(overrides = {}, deps = {}) {
    return {
      ...this.definition(deps),
      ...overrides,
    };
  }

  /**
   * Creates and optionally persists a user record.
   *
   * @param {object} overrides - Properties to override the default definition.
   * @param {object} deps - Optional dependencies, e.g., a user repository.
   * @returns {Promise<object>} A promise that resolves with the created user record.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);

    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    // Ejemplo:
    // if (deps.userRepo && typeof deps.userRepo.create === 'function') {
    //   return deps.userRepo.create(record);
    // }

    // TODO: inyectar repos en deps y crear registros relacionados si aplica.
    // (Este factory PHP no tiene relaciones explícitas, pero es un placeholder útil).

    return record;
  }
}
