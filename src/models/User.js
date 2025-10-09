// migrated from app/Models/User.php

export class User {
  id;
  name;
  email;
  password;
  rememberToken; // From $hidden
  emailVerifiedAt; // Common for Authenticatable
  createdAt;
  updatedAt;

  /**
   * @param {object} props
   * @param {string | null} props.id
   * @param {string} props.name
   * @param {string} props.email
   * @param {string} props.password
   * @param {string | null} [props.rememberToken=null]
   * @param {Date | string | null} [props.emailVerifiedAt=null]
   * @param {Date | string | null} [props.createdAt=null]
   * @param {Date | string | null} [props.updatedAt=null]
   */
  constructor(props) {
    this.id = props.id || null;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password; // Sensitive, typically not retrieved or passed directly after creation
    this.rememberToken = props.rememberToken || null;
    this.emailVerifiedAt = props.emailVerifiedAt ? new Date(props.emailVerifiedAt) : null;
    this.createdAt = props.createdAt ? new Date(props.createdAt) : null;
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : null;
  }

  /**
   * Creates a User instance from a plain object (e.g., from a database row).
   * @param {object} obj The plain object to hydrate from.
   * @param {string | null} obj.id
   * @param {string} obj.name
   * @param {string} obj.email
   * @param {string} obj.password
   * @param {string | null} [obj.remember_token=null] - Note: snake_case for database
   * @param {string | null} [obj.email_verified_at=null]
   * @param {string | null} [obj.created_at=null]
   * @param {string | null} [obj.updated_at=null]
   * @returns {User}
   */
  static from(obj) {
    // TODO: Implement explicit field mapping for $fillable properties for safety (or ignore in constructor)
    // For now, we're assuming the input `obj` aligns with constructor properties after snake_case to camelCase conversion.

    // TODO: Add support for $casts. Currently, dates are casted to Date objects automatically.
    //       Consider a more robust casting mechanism if more complex types are needed.

    return new User({
      id: obj.id || null,
      name: obj.name,
      email: obj.email,
      password: obj.password,
      rememberToken: obj.remember_token || null,
      emailVerifiedAt: obj.email_verified_at || null,
      createdAt: obj.created_at || null,
      updatedAt: obj.updated_at || null,
    });
  }

  /**
   * Returns a plain object representation of the User, suitable for serialization.
   * Omits properties listed in Laravel's $hidden array.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

    // TODO: Implement robust handling for $hidden properties.
    //       For simplicity, 'password' and 'rememberToken' are hardcoded as omitted.
    //       A more generic solution might involve a `getHidden()` static method or an internal list.

    // TODO: Implement $casts for output serialization (e.g., dates to ISO strings, which is done here).

    // Remove properties that are null/undefined or explicitly hidden, if you prefer a cleaner JSON.
    Object.keys(obj).forEach(key => (obj[key] === undefined) && delete obj[key]);

    return obj;
  }

  // TODO: Implement relationships (e.g., posts(), comments()). These would typically be handled
  //       by a repository or a dedicated service layer, not directly on the entity.
  //       e.g., `userRepository.findUserPosts(userId)`

  // TODO: Create a dedicated 'UserRepository' or similar service for persistence logic.
  //       This entity should remain a pure domain object.
}


export default { User };