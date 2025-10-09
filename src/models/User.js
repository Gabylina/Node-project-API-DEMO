// migrated from Laravel Eloquent model: app/Models/User.php

export class User {
  id;
  name;
  email;
  // password; // Stored as a property, but conceptually hidden from serialization
  // rememberToken; // Stored as a property, but conceptually hidden from serialization

  createdAt; // Will be a Date object
  updatedAt; // Will be a Date object

  // Internal list of properties that should not be serialized to JSON
  _hidden = ['password', 'rememberToken'];

  /**
   * Creates an instance of User.
   * @param {object} params - Object containing user properties.
   * @param {string|number} [params.id]
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.password - The hashed password.
   * @param {string} [params.rememberToken]
   * @param {string|Date} [params.createdAt] - Creation timestamp, will be converted to Date.
   * @param {string|Date} [params.updatedAt] - Update timestamp, will be converted to Date.
   * @param {object} [props] - Any additional properties not explicitly listed.
   */
  constructor({
    id,
    name,
    email,
    password,
    rememberToken,
    createdAt,
    updatedAt,
    ...props // Catch-all for any other properties if needed
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.rememberToken = rememberToken;

    // Convert date strings to Date objects for internal use
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;

    // TODO: If the Laravel model had other specific properties (e.g., 'is_admin'),
    // they should be explicitly defined and assigned here.
    // Example: this.isAdmin = props.isAdmin;
    // If you wish to allow arbitrary properties, you can uncomment:
    // Object.assign(this, props);
  }

  /**
   * Creates a User instance from a plain object.
   * This method acts as a simple factory for hydrating the entity.
   * @param {object} obj - A plain object containing user data.
   * @returns {User|null} A User instance or null if the input object is falsy.
   */
  static from(obj) {
    if (!obj) return null;
    return new User(obj);
  }

  /**
   * Returns a JSON serializable representation of the User instance.
   * Properties listed in `_hidden` will be excluded.
   * Date objects will be converted to ISO 8601 strings.
   * @returns {object} A plain object suitable for JSON serialization.
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

    // Remove hidden properties from the JSON output
    for (const key of this._hidden) {
      delete obj[key];
    }

    // Convert Date objects back to ISO strings for consistent JSON output
    if (obj.createdAt instanceof Date) {
      obj.createdAt = obj.createdAt.toISOString();
    }
    if (obj.updatedAt instanceof Date) {
      obj.updatedAt = obj.updatedAt.toISOString();
    }

    return obj;
  }

  // TODO: Implement User repository methods.
  // In a No-ORM setup, a separate repository class (`UserRepository`) would handle
  // data persistence (e.g., fetching from DB, saving, updating).
  // Example: static async findById(id) { return UserRepository.findById(id); }

  // TODO: Define relationships.
  // If User has relationships (e.g., 'hasMany Posts'), methods would be added here
  // to fetch related entities, typically by calling methods on other repositories.
  // Example: async getPosts() { return PostRepository.findByUserId(this.id); }

  // TODO: Map Laravel's $fillable equivalent.
  // In Node with no ORM, the concept of '$fillable' (mass assignment protection)
  // is handled by explicit constructor parameters, DTOs, or validation schemas
  // in the service layer when creating/updating data.
  // Example: static get fillableFields() { return ['name', 'email', 'password']; }

  // TODO: Map Laravel's $casts equivalent.
  // If the Laravel model used `$casts` for type conversion (e.g., 'is_admin' to boolean),
  // this would be handled explicitly in the constructor (e.g., `this.isAdmin = !!props.isAdmin;`)
  // or by specific parsing logic in the `from` method or repository layer.
  // Example: static get casts() { return { 'is_admin': 'boolean' }; }
}


export default { User };