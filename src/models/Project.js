// migrated from app/Models/Project.php

export class Project {
  /**
   * @type {number | null}
   */
  id;

  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  description;

  /**
   * @type {number}
   */
  userId; // Renamed from user_id to camelCase for JS convention

  /**
   * @param {string} name
   * @param {string} description
   * @param {number} userId
   * @param {number | null} [id=null]
   */
  constructor(name, description, userId, id = null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
  }

  /**
   * Creates a Project instance from a plain object.
   * Handles both snake_case (from DB) and camelCase (from JS) for user_id.
   *
   * @param {Object} obj The plain object to convert.
   * @param {number | null} [obj.id]
   * @param {string} obj.name
   * @param {string} obj.description
   * @param {number} [obj.user_id] The user ID (snake_case, typically from DB).
   * @param {number} [obj.userId] The user ID (camelCase, typically from JS).
   * @returns {Project}
   * @throws {Error} If the object is null/undefined or required properties are missing.
   */
  static from(obj) {
    if (!obj) {
      throw new Error('Cannot create Project from null or undefined object.');
    }
    if (typeof obj.name !== 'string' || typeof obj.description !== 'string') {
      throw new Error('Missing or invalid "name" or "description" property.');
    }

    const userId = obj.user_id !== undefined ? obj.user_id : obj.userId;
    if (typeof userId !== 'number') {
        throw new Error('Missing or invalid "user_id" or "userId" property.');
    }

    return new Project(
      obj.name,
      obj.description,
      userId,
      obj.id || null
    );
  }

  /**
   * Converts the Project instance to a plain object for serialization (e.g., to JSON).
   * Outputs properties in camelCase following JavaScript conventions.
   * @returns {Object} A plain object representation of the Project.
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // TODO: Implement repository methods for data persistence (e.g., find, save, update, delete).
  //       These methods typically belong in a separate repository or service layer
  //       and interact with a database driver or ORM.

  // TODO: Review and implement relationships (owner, tasks) as needed.
  //       This class only represents the Project entity itself.
  //       Relationships would typically be loaded/managed by a repository,
  //       service layer, or by a separate "relation loader" mechanism.
  //       For example, a ProjectRepository might have a `getProjectWithOwner(projectId)`
  //       method that fetches the Project and then the associated User.

  // TODO: Handle $fillable properties for mass assignment safety if applicable to your application logic.
  //       In a Node.js context, this typically involves careful input validation and
  //       explicit property assignment in your service or controller layer,
  //       rather than an entity property list like Eloquent's `$fillable`.

  // TODO: Handle $casts (type casting) if specific types are required (e.g., dates, booleans, enums).
  //       Type casting would generally be performed during deserialization (e.g., in the `from` method
  //       or by a data mapping layer) or before saving to the database by the repository.

  // TODO: Handle $hidden properties if certain fields should not be serialized
  //       (e.g., sensitive data, internal-only fields).
  //       This can be managed in the `toJSON` method or by a dedicated serialization function/utility.
}


export default { Project };