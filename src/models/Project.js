// migrated from app/Models/Project.php

export class Project {
  /** @type {number | string | null} */
  id;
  /** @type {string} */
  name;
  /** @type {string | null} */
  description;
  /** @type {number | string} */
  userId; // Corresponds to user_id in Laravel's $fillable
  /** @type {Date | null} */
  createdAt;
  /** @type {Date | null} */
  updatedAt;

  /**
   * Creates a new Project instance.
   * Represents the core domain entity.
   * @param {object} params
   * @param {number | string | null} [params.id=null] - The unique identifier for the project.
   * @param {string} params.name - The name of the project.
   * @param {string | null} [params.description=null] - A description of the project.
   * @param {number | string} params.userId - The ID of the user who owns this project.
   * @param {Date | string | null} [params.createdAt=null] - The creation timestamp.
   * @param {Date | string | null} [params.updatedAt=null] - The last update timestamp.
   */
  constructor({ id = null, name, description = null, userId, createdAt = null, updatedAt = null }) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Project name is required and must be a non-empty string.');
    }
    if (!userId) { // Assuming userId is mandatory for a project
        throw new Error('Project must be associated with a user (userId is required).');
    }

    this.id = id;
    this.name = name.trim();
    this.description = description ? String(description).trim() : null; // Ensure description is string or null
    this.userId = userId;

    // Handle date conversion if they come as strings
    this.createdAt = createdAt instanceof Date ? createdAt : (createdAt ? new Date(createdAt) : null);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : (updatedAt ? new Date(updatedAt) : null);
  }

  /**
   * Factory method to create a Project instance from a raw data object,
   * typically from a database query result.
   * Handles mapping from snake_case (common in DBs) to camelCase.
   * @param {object} rawData - The raw data object.
   * @returns {Project}
   */
  static from(rawData) {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Raw data for Project.from() must be a non-null object.');
    }

    // Map database fields (e.g., snake_case) to constructor parameters (camelCase)
    return new Project({
      id: rawData.id,
      name: rawData.name,
      description: rawData.description,
      userId: rawData.user_id || rawData.userId, // Prioritize user_id from DB, fallback to userId
      createdAt: rawData.created_at || rawData.createdAt,
      updatedAt: rawData.updated_at || rawData.updatedAt,
    });
  }

  /**
   * Returns a plain object representation of the Project instance.
   * Useful for JSON serialization (e.g., API responses) and exposing public attributes.
   * Converts Date objects to ISO 8601 strings.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // --- TODOs for Migrating from Eloquent to a Clean Node.js Entity --- 

  // 1. Data Persistence (Repository Pattern):
  //    Instead of extending `Eloquent\Model` and using static methods (e.g., `Project::create()`, `Project::find()`),
  //    you will implement a `ProjectRepository` class (e.g., `src/repositories/ProjectRepository.js`).
  //    This repository will encapsulate all database interactions for Project entities.
  //    Example:
  //      `const projectRepository = new ProjectRepository(dbClient);`
  //      `const project = await projectRepository.findById(projectId);`
  //      `await projectRepository.save(newProjectInstance);`

  // 2. Relationships (owner(), tasks()):
  //    Eloquent's magical relationship methods (e.g., `project->owner`, `project->tasks`)
  //    are replaced by explicit loading. Relationships are not part of the core domain entity
  //    itself but are handled by the repository or a dedicated service.
  //    - `owner()` (BelongsTo): To get the owner of a project, you'd typically fetch it
  //      separately using a `UserRepository`:
  //      `const owner = await userRepository.findById(this.userId);`
  //    - `tasks()` (HasMany): To get tasks for a project, you'd use a `TaskRepository`:
  //      `const tasks = await taskRepository.findByProjectId(this.id);`
  //    If you need to load related entities often, your `ProjectRepository` might
  //    offer methods like `findByIdWithOwner(projectId)` or `findByIdWithTasks(projectId)`.

  // 3. $fillable:
  //    The constructor of this `Project` class now explicitly defines which properties
  //    can be set upon instantiation. This serves a similar purpose to `$fillable`,
  //    controlling what data can be used to create or update an entity instance.
  //    For updates, you'd typically load the entity, modify its properties, and then
  //    pass it to `projectRepository.update(projectInstance)`.

  // 4. $casts:
  //    Type casting (e.g., `datetime`, `boolean`, `json`) is handled manually.
  //    In this class, `createdAt` and `updatedAt` are cast to `Date` objects in the constructor
  //    and the `from` static method. For other types (e.g., if `description` was a JSON column),
  //    you would add specific parsing logic in `from()` and serialization logic in `toJSON()`.

  // 5. $hidden:
  //    Properties that should not be exposed when the object is converted to JSON
  //    (e.g., passwords, sensitive internal data) can simply be omitted from the `toJSON()` method.
  //    This `toJSON()` method serves the same purpose of controlling public serialization.
}

export default { Project };