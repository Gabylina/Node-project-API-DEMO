// migrated from Laravel Eloquent Model Project.php
export class Project {
    /**
     * Represents a Project entity.
     * @param {object} props
     * @param {string|number} [props.id] - The unique identifier of the project.
     * @param {string} props.name - The name of the project.
     * @param {string|null} [props.description=null] - The description of the project.
     * @param {string|number} props.userId - The ID of the user who owns this project.
     */
    constructor({ id, name, description = null, userId }) {
        if (name === undefined || userId === undefined) {
            throw new Error('Project name and userId are required.');
        }

        this.id = id;
        this.name = name;
        this.description = description;
        this.userId = userId;
    }

    /**
     * Creates a Project instance from a plain object, typically from a database record or API payload.
     * Maps snake_case keys (common in database) to camelCase (common in JavaScript).
     * @param {object} obj - The plain object containing project data.
     * @returns {Project|null} Returns a Project instance or null if the input object is falsy.
     * @throws {Error} If the input for Project.from() is not an object.
     */
    static from(obj) {
        if (!obj) return null;

        if (typeof obj !== 'object' || Array.isArray(obj)) {
            throw new Error('Input for Project.from() must be an object.');
        }

        return new Project({
            id: obj.id,
            name: obj.name,
            description: obj.description,
            userId: obj.user_id // Map 'user_id' from database/API to 'userId' property
        });
    }

    /**
     * Converts the Project instance to a plain object, typically for database storage or API response.
     * Maps camelCase keys back to snake_case where appropriate for database/API consistency.
     * @returns {object} A plain object representation of the project.
     */
    toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

        // Only include id if it's set (e.g., for existing entities)
        if (this.id !== undefined && this.id !== null) {
            obj.id = this.id;
        }

        return obj;
    }

    // TODO: Repository interaction
    // Implement a `ProjectRepository` (e.g., in `src/repositories/ProjectRepository.js`)
    // for database operations (e.g., `create`, `findById`, `update`, `delete`, `findByUserId`).
    // This entity class should remain focused on business logic and state, not direct persistence.

    // TODO: Relationships (owner, tasks)
    // The `owner()` (BelongsTo User) and `tasks()` (HasMany Task) relationships defined in Laravel
    // should be handled by an application service or the repository layer in Node.js.
    // The Project entity itself should not directly load or manage other entities.
    // Example: A `ProjectService` might have methods like `getProjectWithOwner(projectId)`
    // or `getProjectWithTasks(projectId)` that use `UserRepository` and `TaskRepository`.

    // TODO: `$fillable` fields
    // The properties `name`, `description`, and `userId` (mapped from `user_id`) directly
    // correspond to the `$fillable` fields in the Laravel model. In this JS class,
    // all properties passed to the constructor are effectively fillable.

    // TODO: `$casts`
    // If the Laravel model had `$casts` (e.g., `['created_at' => 'datetime', 'is_active' => 'boolean']`),
    // corresponding type conversion logic would be needed in the `from()` and `toJSON()` methods.
    // For example, converting `obj.created_at` to a `Date` object and `this.createdAt.toISOString()`.
    // This model does not explicitly define `$casts`, but `created_at`/`updated_at` (if present)
    // would typically be handled here.

    // TODO: `$hidden` fields
    // If the Laravel model had `$hidden` fields (e.g., `password`, `api_token`),
    // these fields should generally *not* be included in the `toJSON()` method
    // to prevent sensitive data exposure in API responses. They would need to be handled
    // by a specific serializer or excluded during object creation for public views.
}


export default { Project };