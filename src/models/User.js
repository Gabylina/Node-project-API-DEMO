// migrated from app/Models/User.php

export class User {
  /**
   * @param {number|null} id
   * @param {string} name
   * @param {string} email
   * @param {string} password - Hashed password
   * @param {string|null} rememberToken
   * @param {Date} [createdAt=new Date()]
   * @param {Date} [updatedAt=new Date()]
   */
  constructor(
    id,
    name,
    email,
    password,
    rememberToken = null,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    if (name === undefined || email === undefined || password === undefined) {
      throw new Error('User constructor: Missing essential properties (name, email, password)');
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // Stored as hashed password
    this.rememberToken = rememberToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates a User instance from a plain object (e.g., from a database row).
   * Assumes object keys are snake_case or camelCase and handles date parsing.
   * @param {Object} obj - Plain object with user data.
   * @returns {User}
   */
  static from(obj) {
    const id = obj.id;
    const name = obj.name;
    const email = obj.email;
    const password = obj.password; // Even if hidden, it's part of the raw data
    const rememberToken = obj.remember_token || obj.rememberToken || null;
    const createdAt = obj.created_at || obj.createdAt;
    const updatedAt = obj.updated_at || obj.updatedAt;

    if (id === undefined || name === undefined || email === undefined || password === undefined) {
      throw new Error('User.from(): Missing essential properties (id, name, email, password)');
    }

    return new User(
      id,
      name,
      email,
      password,
      rememberToken,
      createdAt ? new Date(createdAt) : undefined,
      updatedAt ? new Date(updatedAt) : undefined
    );
  }

  /**
   * Returns a plain object representation of the User instance.
   * Omits properties defined as '$hidden' in the original Laravel model.
   * Converts dates to ISO strings and uses snake_case for consistency with API/DB output.
   * @returns {Object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // TODO: Implement a repository for User persistence (CRUD operations).
  // TODO: Define and implement relationships (e.g., posts() for hasMany) if applicable.
  // TODO: Re-implement Laravel's 'Authenticatable' logic (e.g., password hashing, user lookup for authentication) in a dedicated authentication service.
  // TODO: Integrate functionality from Laravel traits like 'HasApiTokens' (e.g., token generation/management) and 'Notifiable' (e.g., notification sending).
  // TODO: Consider how '$fillable' logic (mass assignment protection) will be handled, likely within a factory or repository method that creates/updates User instances from DTOs.
  // TODO: If the original model had '$casts' (e.g., for dates, booleans, JSON fields), ensure proper type conversion during hydration and serialization.
}


export default { User };