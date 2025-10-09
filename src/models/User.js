// migrated from app/Models/User.php

export class User {
  /** @type {number|undefined} - The unique identifier for the user. */
  id;
  /** @type {string} - The name of the user. */
  name;
  /** @type {string} - The email address of the user, must be unique. */
  email;
  /** @type {string} - The hashed password of the user. */
  password;
  /** @type {string|undefined} - The remember token for 'remember me' functionality. */
  rememberToken;
  /** @type {Date|undefined} - The timestamp when the user was created. */
  createdAt;
  /** @type {Date|undefined} - The timestamp when the user was last updated. */
  updatedAt;

  /**
   * Constructs a User instance.
   * @param {object} props - Properties to initialize the User.
   * @param {number} [props.id]
   * @param {string} props.name
   * @param {string} props.email
   * @param {string} props.password - Hashed password.
   * @param {string} [props.rememberToken]
   * @param {Date|string} [props.createdAt]
   * @param {Date|string} [props.updatedAt]
   * @throws {Error} If `name`, `email`, or `password` are missing.
   */
  constructor({ id, name, email, password, rememberToken, createdAt, updatedAt }) {
    if (!name || !email || !password) {
      throw new Error("User requires name, email, and password.");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // This should be a hashed password.
    this.rememberToken = rememberToken;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }

  /**
   * Creates a User instance from a plain object (e.g., from a database row or request body).
   * It handles conversion from snake_case database fields to camelCase properties.
   * @param {object} obj - The plain object to convert.
   * @returns {User|null} A new User instance or null if the input object is null/undefined.
   */
  static from(obj) {
    if (!obj) {
      return null;
    }
    return new User({
      id: obj.id,
      name: obj.name,
      email: obj.email,
      password: obj.password,
      rememberToken: obj.remember_token, // Laravel's snake_case for DB field
      createdAt: obj.created_at,       // Laravel's snake_case for DB field
      updatedAt: obj.updated_at,       // Laravel's snake_case for DB field
    });
  }

  /**
   * Returns a plain object representation of the User instance.
   * By default, it excludes fields typically hidden by Laravel's `$hidden` array (e.g., password, rememberToken),
   * making it suitable for public API responses.
   * @returns {object} A plain object with user properties.
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

    // Fields like 'password' and 'rememberToken' were marked as $hidden in Laravel's model.
    // They are intentionally excluded from the default `toJSON` output for security reasons.
    // If needed for specific internal logic, they can be accessed directly as `this.password` etc.

    return obj;
  }

  // --- TODOs for Laravel to Node.js Domain Entity Migration --- 

  // TODO: Repository Integration
  // This class represents the domain entity, focusing on data and business logic.
  // Persistence (saving, fetching, deleting) should be handled by a separate `UserRepository`.
  // Example structure:
  // async save() { 
  //   if (this.id) { return UserRepository.update(this); }
  //   else { return UserRepository.create(this); }
  // }
  // static async find(id) { return UserRepository.findById(id); }
  // static async all() { return UserRepository.findAll(); }

  // TODO: Relationships
  // If the Laravel `User` model had relationships (e.g., `hasMany Posts`, `belongsTo Company`),
  // these should be represented here, often as methods that load related entities 
  // via their respective repositories.
  // Example:
  // async posts() { return PostRepository.findByUserId(this.id); }
  // async company() { return CompanyRepository.findById(this.companyId); }

  // TODO: `$fillable` attributes from Laravel (['name', 'email', 'password'])
  // In a Node.js domain entity, these attributes are directly represented as properties.
  // Ensure that any input validation or mass assignment restrictions (if applicable)
  // are handled at the application layer (e.g., DTOs, request validation, or in the UserRepository's `create`/`update` methods).

  // TODO: `$casts` attributes from Laravel (none specified in original, but common)
  // If the Laravel model had `$casts` (e.g., 'is_admin' => 'boolean', 'options' => 'array'),
  // ensure properties in this class are correctly converted to their JavaScript types
  // within the `constructor` or `static from` method.
  // Example: `this.isAdmin = !!obj.is_admin;` or `this.options = JSON.parse(obj.options_json_string);`

  // TODO: `$hidden` attributes from Laravel (['password', 'remember_token'])
  // These fields are intentionally excluded from the default `toJSON()` method 
  // to prevent accidental exposure in API responses. Access them directly using `this.password`
  // when needed internally (e.g., for authentication checks), but avoid exposing them publicly.
}


export default { User };