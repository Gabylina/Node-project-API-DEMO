// migrated from app/Models/Task.php

// TODO: Define TaskStatus Enum if needed, or import from a common location.
// import { TaskStatus } from '../enums/TaskStatus.js';

export class Task {
  id;
  project_id;
  title;
  description;
  status; // TODO: Implement casting for TaskStatus Enum. Will likely store raw value (string/int) here.
  assigned_to;
  created_at;
  updated_at;

  /**
   * Creates a new Task instance.
   * @param {object} data - Initial data for the task. Fields correspond to Eloquent properties.
   * @param {number|null} data.id - The primary key of the task.
   * @param {number|null} data.project_id - The ID of the associated project.
   * @param {string} data.title - The title of the task.
   * @param {string|null} data.description - The description of the task.
   * @param {string|number|null} data.status - The status of the task. Will be cast to TaskStatus Enum.
   * @param {number|null} data.assigned_to - The ID of the user assigned to the task.
   * @param {string|Date|null} data.created_at - Timestamp of creation.
   * @param {string|Date|null} data.updated_at - Timestamp of last update.
   */
  constructor({
    id = null,
    project_id = null,
    title = '',
    description = null,
    status = null, // This could be a raw value or an enum instance depending on cast logic
    assigned_to = null,
    created_at = null,
    updated_at = null,
  } = {}) {
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
   * This method emulates the hydration process for an Eloquent model.
   * @param {object} obj - The plain object representing the task.
   * @returns {Task}
   */
  static from(obj) {
    // TODO: Implement `$fillable` logic here if you want to restrict which properties can be set
    // from an external object, similar to Laravel's mass assignment protection.
    // A robust solution might involve validating `obj` against expected fields, or a DTO pattern.

    // TODO: Apply `$casts` for `status` (TaskStatus Enum).
    // If TaskStatus is an Enum, you might instantiate it here:
    // const statusValue = obj.status ? TaskStatus.fromValue(obj.status) : null;
    // For now, we pass the raw value directly to the constructor.

    return new Task({
      id: obj.id,
      project_id: obj.project_id,
      title: obj.title,
      description: obj.description,
      status: obj.status,
      assigned_to: obj.assigned_to,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
    });
  }

  /**
   * Returns a plain object representation of the Task, suitable for JSON serialization.
   * This method emulates the behavior of casting an Eloquent model to an array or JSON.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // TODO: Repository integration.
  // In Node.js, database operations (create, read, update, delete) are typically
  // handled by a separate repository layer. This entity should not contain direct
  // database logic. Instead, you'd interact with a `TaskRepository`.
  // Example usage: `await TaskRepository.save(this);` or `await TaskRepository.delete(this.id);`

  // TODO: Relation methods.
  // Laravel's `belongsTo` relations (`project`, `assignee`) mean `project_id` and `assigned_to`
  // are foreign keys. In Node.js, you'd load these related entities explicitly via a repository,
  // usually in an asynchronous getter or service method.

  /**
   * Asynchronously loads and returns the associated Project entity.
   * This emulates Laravel's `$task->project` when eager loading or lazy loading.
   * @returns {Promise<any|null>} The Project entity or null if not found or `project_id` is null.
   */
  async getProject() {
    // Example: import { ProjectRepository } from '../repositories/ProjectRepository.js';
    // return this.project_id ? await ProjectRepository.findById(this.project_id) : null;
    console.warn("TODO: Implement getProject() relation loading via ProjectRepository.");
    return null;
  }

  /**
   * Asynchronously loads and returns the associated Assignee (User) entity.
   * This emulates Laravel's `$task->assignee`.
   * @returns {Promise<any|null>} The User entity or null if not found or `assigned_to` is null.
   */
  async getAssignee() {
    // Example: import { UserRepository } from '../repositories/UserRepository.js';
    // return this.assigned_to ? await UserRepository.findById(this.assigned_to) : null;
    console.warn("TODO: Implement getAssignee() relation loading via UserRepository.");
    return null;
  }
}


export default { Task };