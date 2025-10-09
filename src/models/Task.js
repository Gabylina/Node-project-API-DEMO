// migrated from app/Models/Task.php

// TODO: Define or import TaskStatus enum. Example:
// export const TaskStatus = {
//   PENDING: 'pending',
//   IN_PROGRESS: 'in_progress',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled',
//   from: (value) => {
//     const status = Object.values(TaskStatus).find(s => s === value);
//     if (status) return status;
//     throw new Error(`Invalid TaskStatus value: ${value}`);
//   }
// };

export class Task {
  // Properties corresponding to database columns.
  // These align with $fillable and implicit Laravel columns (id, timestamps).
  id;
  project_id;
  title;
  description;
  status; // Will hold a value from the TaskStatus enum (e.g., 'pending', 'completed')
  assigned_to; // Foreign key for User
  created_at; // Date object
  updated_at; // Date object

  /**
   * Constructs a new Task instance.
   * @param {object} params - The properties for the task.
   * @param {number} params.id - The unique identifier of the task.
   * @param {number} params.project_id - The ID of the project this task belongs to.
   * @param {string} params.title - The title of the task.
   * @param {string|null} params.description - The description of the task.
   * @param {string} params.status - The current status of the task (e.g., 'pending', 'in_progress').
   * @param {number|null} params.assigned_to - The ID of the user assigned to this task.
   * @param {Date|string|null} [params.created_at] - The creation timestamp.
   * @param {Date|string|null} [params.updated_at] - The last update timestamp.
   */
  constructor({ id, project_id, title, description, status, assigned_to, created_at = null, updated_at = null }) {
    this.id = id;
    this.project_id = project_id;
    this.title = title;
    this.description = description;
    this.status = status; // TODO: If TaskStatus is a class, convert here: `TaskStatus.from(status)`
    this.assigned_to = assigned_to;
    this.created_at = created_at ? new Date(created_at) : null;
    this.updated_at = updated_at ? new Date(updated_at) : null;
  }

  /**
   * Creates a Task instance from a plain object (e.g., from a database row or request body).
   * @param {object} obj - The plain object containing task data.
   * @returns {Task}
   *
   * @TODO `$fillable`: In a real application, you might want to whitelist properties
   *                     here or validate against a schema to prevent mass assignment vulnerabilities
   *                     or unexpected data. The current implementation directly assigns properties expected from the input obj.
   */
  static from(obj) {
    if (!obj) {
      throw new Error("Cannot create Task from null or undefined object.");
    }
    // TODO `$casts`: Implement type casting as defined in Laravel's $casts property.
    // For 'status', ensure it's converted to the TaskStatus enum if it's a specific class/object.
    // Example: status: TaskStatus.from(obj.status), if TaskStatus is an enum class.
    return new Task({
      id: obj.id,
      project_id: obj.project_id,
      title: obj.title,
      description: obj.description,
      status: obj.status, // Assuming `TaskStatus` is already a valid string or numeric type
      assigned_to: obj.assigned_to,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
    });
  }

  /**
   * Converts the Task instance to a plain object, suitable for JSON serialization or database storage.
   * @returns {object}
   *
   * @TODO `$hidden`: If there were properties in Laravel's `$hidden` array,
   *                   exclude them from this serialized output (e.g., password, sensitive data).
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // TODO: Relationships: In a no-ORM setup, relationships like `belongsTo` are typically
  //       managed by a repository or service layer, not directly on the entity itself.
  //       The foreign keys (`project_id`, `assigned_to`) are the direct representation on the entity.
  //       You would typically use a `TaskRepository` to fetch tasks and potentially hydrate
  //       them with related `Project` or `User` entities through explicit loading methods.
  // Example for loading related data (illustrative, but generally not part of the entity class directly):
  // async getProject(projectRepository) {
  //   if (!this._project && this.project_id) {
  //     this._project = await projectRepository.findById(this.project_id);
  //   }
  //   return this._project;
  // }
}

export default { Task };