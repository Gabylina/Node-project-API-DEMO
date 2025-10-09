// migrated from app/Models/Task.php

export class Task {
    // TODO: Repository - This entity is responsible for its own state,
    // but persistence (save, find, delete) should be handled by a dedicated Repository (e.g., TaskRepository).

    // Properties derived from Laravel's $fillable and implicit Eloquent fields
    id;
    project_id;
    title;
    description;
    status; // TODO: $casts - Consider defining a proper JS Enum type for TaskStatus (e.g., TaskStatusEnum)
    assigned_to;
    created_at; // Date object
    updated_at; // Date object

    /**
     * Constructs a new Task entity.
     * @param {object} props - Properties to initialize the task.
     * @param {string|null} [props.id=null] - Unique identifier for the task.
     * @param {string|null} [props.project_id=null] - ID of the project this task belongs to.
     * @param {string|null} [props.title=null] - The title of the task.
     * @param {string|null} [props.description=null] - A description of the task.
     * @param {string|null} [props.status=null] - The current status of the task. // TODO: $casts - Laravel used TaskStatus::class here. Map to a JS Enum or string.
     * @param {string|null} [props.assigned_to=null] - ID of the user assigned to this task.
     * @param {Date|null} [props.created_at=null] - Timestamp when the task was created.
     * @param {Date|null} [props.updated_at=null] - Timestamp when the task was last updated.
     */
    constructor({
        id = null,
        project_id = null,
        title = null,
        description = null,
        status = null,
        assigned_to = null,
        created_at = null,
        updated_at = null
    }) {
        // TODO: $fillable - These properties correspond to Laravel's $fillable array.
        // In a clean architecture, these are simply the core properties of the entity.
        this.id = id;
        this.project_id = project_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.assigned_to = assigned_to;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Creates a Task instance from a plain object (e.g., from a database row or API response).
     * This method handles type conversions similar to Laravel's $casts.
     * @param {object} obj - The plain object containing task data.
     * @returns {Task} A new Task instance.
     */
    static from(obj) {
        if (!obj) {
            return null;
        }

        // TODO: $casts - Apply type conversions as specified in Laravel's $casts property.
        // For 'status' (TaskStatus::class): Map the string value to a JS Enum if one exists, or keep as string.
        // Example if you define a TaskStatusEnum: status: obj.status ? TaskStatusEnum.fromValue(obj.status) : null
        const statusValue = obj.status; // Keeping as string for now, add proper Enum mapping if needed.

        return new Task({
            id: obj.id,
            project_id: obj.project_id,
            title: obj.title,
            description: obj.description,
            status: statusValue,
            assigned_to: obj.assigned_to,
            created_at: obj.created_at ? new Date(obj.created_at) : null,
            updated_at: obj.updated_at ? new Date(obj.updated_at) : null,
        });
    }

    /**
     * Returns a plain object representation of the Task instance, suitable for serialization (e.g., JSON API).
     * This method is similar to Laravel's toArray() or JSON serialization, respecting $hidden properties.
     * @returns {object} A plain object with the task's properties.
     */
    toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
    }

    // TODO: Relationships - In a non-ORM context, these methods represent foreign keys
    // and imply that a separate service or repository is needed to fetch the related entities.

    /**
     * // Laravel equivalent: public function project(): BelongsTo
     * This indicates a relationship to a Project entity via `project_id`.
     * To fetch the related Project, you would typically use a ProjectRepository:
     * // Example: async getProject(projectRepository) { return await projectRepository.findById(this.project_id); }
     * // Ensure you have a 'Project' entity class and 'ProjectRepository'.
     */

    /**
     * // Laravel equivalent: public function assignee(): BelongsTo
     * This indicates a relationship to a User entity via `assigned_to`.
     * To fetch the related User (assignee), you would typically use a UserRepository:
     * // Example: async getAssignee(userRepository) { return await userRepository.findById(this.assigned_to); }
     * // Ensure you have a 'User' entity class and 'UserRepository'.
     */
}


export default { Task };