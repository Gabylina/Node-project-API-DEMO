/* migrated from database/factories/UserFactory.php */

/**
 * @class UserFactory
 * Represents a factory for creating User data.
 * Migrated from Laravel's UserFactory.php.
 */
export class UserFactory {
  /**
   * Defines the default state for a User model.
   * @param {object} deps - Optional dependencies (e.g., configurations).
   * @returns {object} A plain object with default user data.
   */
  static definition(deps = {}) {
    return {
      name: 'John Doe', // TODO: integrar Faker de Node (p.ej. @faker-js/faker)
      email: 'john.doe@example.com', // TODO: integrar Faker de Node (p.ej. @faker-js/faker)
      email_verified_at: new Date().toISOString(), // TODO: revisar formato de fecha/hora si debe ser un Date object o string específico
      password: 'hashed_password_placeholder', // TODO: integrar hashing (p.ej. bcrypt) y manejar cacheo si es necesario
      remember_token: 'random_string_placeholder', // TODO: generar string aleatorio (p.ej. crypto.randomBytes)
    };
  }

  /**
   * Creates a user data object with default values, applying any overrides.
   * @param {object} overrides - Optional object to override default data.
   * @param {object} deps - Optional dependencies.
   * @returns {object} A user data object.
   */
  static make(overrides = {}, deps = {}) {
    return { ...this.definition(deps), ...overrides };
  }

  /**
   * Creates and optionally persists a user record.
   * @param {object} overrides - Optional object to override default data.
   * @param {object} deps - Optional dependencies, potentially including a repository.
   * @returns {Promise<object>} The created user record.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    // Ejemplo: if (deps.userRepo) { return await deps.userRepo.create(record); }
    return record;
  }
}
