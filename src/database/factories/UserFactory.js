/* migrated from database/factories/UserFactory.php */

export class UserFactory {
  /**
   * Define the model's default state.
   * @param {object} deps - Dependencies like repositories or config.
   * @returns {object} A plain object with default data.
   */
  static definition(deps = {}) {
    return {
      name: 'John Doe', // TODO: integrar Faker de Node (p.ej. @faker-js/faker) para 'fake()->name()'
      email: 'john.doe@example.com', // TODO: integrar Faker de Node (p.ej. @faker-js/faker) para 'fake()->unique()->safeEmail()'
      email_verified_at: new Date().toISOString(), // Mapea 'now()'
      password: 'password', // TODO: hashear la contraseña (p.ej. bcrypt) como 'Hash::make('password')'. La lógica de caché de PHP '$password ??=' se gestionaría a nivel de aplicación si es necesario.
      remember_token: 'random_string_10_chars', // TODO: generar token aleatorio de 10 caracteres (p.ej. usando crypto) como 'Str::random(10)'
    };
  }

  /**
   * Create a record object with default data and apply overrides.
   * @param {object} overrides - Fields to override default values.
   * @param {object} deps - Dependencies.
   * @returns {object} The complete record object.
   */
  static make(overrides = {}, deps = {}) {
    return {
      ...this.definition(deps),
      ...overrides,
    };
  }

  /**
   * Create and potentially persist a record.
   * @param {object} overrides - Fields to override default values.
   * @param {object} deps - Dependencies like repositories.
   * @returns {Promise<object>} The created record object.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    return record;
  }
}
