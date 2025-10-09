// migrated from app/Models/User.php

export class User {
  id;
  name;
  email;
  password; // Sensitive: handle securely (hash, never expose directly)
  emailVerifiedAt; // Corresponds to Laravel's Authenticatable usually
  rememberToken;   // From Laravel's Authenticatable/hidden fields
  createdAt;
  updatedAt;

  /**
   * Constructs a new User entity.
   * @param {object} props - Properties to initialize the User.
   * @param {number} [props.id]
   * @param {string} props.name
   * @param {string} props.email
   * @param {string} [props.password] - Hashed password.
   * @param {Date|string|null} [props.emailVerifiedAt]
   * @param {string|null} [props.rememberToken]
   * @param {Date|string} [props.createdAt]
   * @param {Date|string} [props.updatedAt]
   */
  constructor(props = {}) {
    this.id = props.id ?? null;
    this.name = props.name ?? '';
    this.email = props.email ?? '';
    this.password = props.password ?? null; // Store hashed password
    this.emailVerifiedAt = props.emailVerifiedAt ? new Date(props.emailVerifiedAt) : null;
    this.rememberToken = props.rememberToken ?? null;
    this.createdAt = props.createdAt ? new Date(props.createdAt) : null;
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : null;
  }

  /**
   * Creates a User instance from a plain object (e.g., database result).
   * @param {object} obj - The plain object containing user data.
   * @returns {User}
   */
  static from(obj) {
    // TODO: This 'from' method implicitly handles properties similar to Laravel's 'fillable'.
    //       Only properties defined here will be mapped. Ensure validation and proper type handling for inputs.
    //       Consider a dedicated 'UserFactory' for more complex instantiation or validation scenarios.
    return new User({
      id: obj.id,
      name: obj.name,
      email: obj.email,
      password: obj.password, // This should be already hashed from the database/source
      emailVerifiedAt: obj.email_verified_at || obj.emailVerifiedAt, // Handle snake_case from DB
      rememberToken: obj.remember_token || obj.rememberToken,       // Handle snake_case from DB
      createdAt: obj.created_at || obj.createdAt,                   // Handle snake_case from DB
      updatedAt: obj.updated_at || obj.updatedAt,                   // Handle snake_case from DB
    });
  }

  /**
   * Returns a plain object representation of the User,
   * excluding sensitive or hidden fields.
   * Mimics Laravel's $hidden behavior.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
    return obj;
  }

  // TODOs for further development:

  /**
   * TODO: Repository Integration
   *   Define methods for data persistence (e.g., save(), delete()).
   *   These methods would interact with a `UserRepository` responsible
   *   for database operations without an ORM.
   *   Example:
   *   async save(userRepository) {
   *     if (this.id) {
   *       await userRepository.update(this);
   *     } else {
   *       await userRepository.create(this);
   *     }
   *   }
   */

  /**
   * TODO: Relationships (from HasApiTokens trait)
   *   If this User has associated API tokens, define a method
   *   to retrieve them. This would interact with an `ApiTokenRepository`.
   *   Example:
   *   async apiTokens(apiTokenRepository) {
   *     return apiTokenRepository.findByUserId(this.id);
   *   }
   */

  /**
   * TODO: Password Hashing and Verification
   *   Implement methods for securely handling passwords.
   *   This usually involves a library like `bcrypt`.
   *   Example:
   *   async setPassword(plainPassword) {
   *     this.password = await bcrypt.hash(plainPassword, 10);
   *   }
   *   async checkPassword(plainPassword) {
   *     return bcrypt.compare(plainPassword, this.password);
   *   }
   */

  /**
   * TODO: Equivalent of Laravel's $fillable
   *   In this ORM-less approach, the `constructor` and `static from` methods
   *   implicitly control which properties can be set. Ensure your `UserRepository`
   *   also respects this for create/update operations to prevent unwanted mass assignment.
   *   Consider a separate DTO (Data Transfer Object) for incoming request data if more strict control is needed.
   */

  /**
   * TODO: Equivalent of Laravel's $casts
   *   Implement explicit type casting for properties (e.g., dates, booleans, JSON columns)
   *   when converting from raw database values or external inputs.
   *   This is partially handled in the constructor/from method for `Date` objects.
   *   Example:
   *   static from(obj) {
   *     const user = new User(...);
   *     user.emailVerifiedAt = obj.email_verified_at ? new Date(obj.email_verified_at) : null;
   *     // ... other casts for booleans, JSON, etc.
   *     return user;
   *   }
   */
}


export default { User };