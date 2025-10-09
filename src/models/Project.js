// migrated from app/Models/Project.php

export class Project {
  /**
   * @param {object} props - Properties to initialize the Project.
   * @param {string|number} props.id - Unique identifier for the project.
   * @param {string} props.name - The name of the project.
   * @param {string|null} [props.description=null] - An optional description of the project.
   * @param {string|number} props.userId - The ID of the user who owns the project.
   * @param {Date|string} [props.createdAt=new Date()] - The timestamp when the project was created.
   * @param {Date|string} [props.updatedAt=new Date()] - The timestamp when the project was last updated.
   */
  constructor({ id, name, description = null, userId, createdAt = new Date(), updatedAt = new Date() }) {
    if (id === undefined || id === null) {
      throw new Error('Project ID is required.');
    }
    if (!name || typeof name !== 'string') {
      throw new Error('Project name is required and must be a string.');
    }
    if (userId === undefined || userId === null) {
      throw new Error('Project must have a user ID.');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  /**
   * Creates a Project instance from a plain object (e.g., a database row).
   * This method maps snake_case properties from the source object to camelCase
   * properties of the Project class and handles initial type conversions.
   * @param {object} obj - The plain object containing project data.
   * @returns {Project}
   */
  static from(obj) {
    // TODO: $fillable - In a Node.js context, explicit filtering of allowed input properties
    // (similar to Eloquent's $fillable) typically occurs in a DTO (Data Transfer Object)
    // or a validation layer before reaching the domain entity. This `from` method
    // assumes `obj` is a trusted source (e.g., data already retrieved from a database).

    if (!obj || typeof obj !== 'object') {
      throw new Error('Invalid object provided for Project.from().');
    }

    return new Project({
      id: obj.id,
      name: obj.name,
      description: obj.description,
      userId: obj.user_id, // Map 'user_id' from database (snake_case) to 'userId' (camelCase)
      createdAt: obj.created_at, // Constructor will handle Date conversion from string
      updatedAt: obj.updated_at  // Constructor will handle Date conversion from string
    });
  }

  /**
   * Returns a plain object representation of the Project instance,
   * suitable for JSON serialization (e.g., for API responses).
   * Dates are converted to ISO 8601 strings.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }
}


export default { Project };