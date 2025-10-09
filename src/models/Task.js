// migrated from app/Models/Task.php

/**
 * @typedef {'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'} TaskStatus
 * // TODO: For a more robust solution, define TaskStatus as an actual enum object (e.g., using a dedicated enum module).
 * // Example:
 * // export const TaskStatusEnum = Object.freeze({
 * //   PENDING: 'pending',
 * //   IN_PROGRESS: 'in_progress',
 * //   COMPLETED: 'completed',
 * //   fromValue: (value) => Object.values(TaskStatusEnum).find(v => v === value) || 'pending'
 * // });
 */

/**
 * Represents a Task entity.
 * This clean JavaScript class replaces Laravel's Eloquent Model for domain representation.
 */
export class Task {
  /** @type {string | null} */
  id;

  /** @type {string | null} */
  project_id;

  /** @type {string} */
  title;

  /** @type {string | null} */
  description;

  /** @type {TaskStatus} */
  status;

  /** @type {string | null} */
  assigned_to;

  /** @type {Date | null} */
  created_at;

  /** @type {Date | null} */
  updated_at;

  // TODO: Relationships are typically loaded via a repository or can be included if eager-loaded.
  // For a clean domain entity, these properties are placeholders for related entities.
  /** @type {object | null} */
  project;

  /** @type {object | null} */
  assignee;

  /**
   * Constructs a new Task instance.
   * @param {object} params
   * @param {string | null} [params.id=null]
   * @param {string | null} [params.project_id=null] // Corresponds to 'project_id' in $fillable
   * @param {string} params.title // Corresponds to 'title' in $fillable
   * @param {string | null} [params.description=null] // Corresponds to 'description' in $fillable
   * @param {TaskStatus} [params.status='pending'] // Corresponds to 'status' in $fillable, cast to TaskStatus
   * @param {string | null} [params.assigned_to=null] // Corresponds to 'assigned_to' in $fillable
   * @param {Date | string | null} [params.created_at=null]
   * @param {Date | string | null} [params.updated_at=null]
   * @param {object | null} [params.project=null] // Optional related Project object (if eager-loaded)
   * @param {object | null} [params.assignee=null] // Optional related User object (if eager-loaded)
   */
  constructor({
    id = null,
    project_id = null,
    title,
    description = null,
    status = 'pending',
    assigned_to = null,
    created_at = null,
    updated_at = null,
    project = null,
    assignee = null,
  }) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Task title is required and must be a non-empty string.');
    }

    this.id = id;
    this.project_id = project_id;
    this.title = title.trim();
    this.description = description ? String(description).trim() : null;
    // TODO: Implement proper $casts for status (e.g., validate and convert against TaskStatus enum values if a class is used).
    // For now, it accepts a string, assuming it's a valid TaskStatus.
    this.status = status;
    this.assigned_to = assigned_to;
    this.created_at = created_at ? new Date(created_at) : null;
    this.updated_at = updated_at ? new Date(updated_at) : null;

    // Related entities are set directly if provided, implying eager loading.
    this.project = project;
    this.assignee = assignee;
  }

  /**
   * Creates a Task instance from a plain object (e.g., from a database record or API payload).
   * This method handles hydrating the entity from raw data.
   * @param {object} obj - The plain object containing task data.
   * @returns {Task}
   * @throws {Error} If the provided object is invalid.
   */
  static from(obj) {
    if (!obj || typeof obj !== 'object') {
      throw new Error('Invalid object provided to Task.from().');
    }

    // TODO: Apply $casts conversions here, especially for `status` to a specific enum if implemented.
    // Ensure related objects are also passed if present (e.g., from joins or nested data).
    const project = obj.project && typeof obj.project === 'object' ? obj.project : null;
    const assignee = obj.assignee && typeof obj.assignee === 'object' ? obj.assignee : null;

    return new Task({
      id: obj.id ?? null,
      project_id: obj.project_id ?? null,
      title: obj.title,
      description: obj.description ?? null,
      status: obj.status ?? 'pending', // Apply default if not provided, consistent with constructor
      assigned_to: obj.assigned_to ?? null,
      created_at: obj.created_at ?? null,
      updated_at: obj.updated_at ?? null,
      project: project, // Pass related object if present
      assignee: assignee, // Pass related object if present
    });
  }

  /**
   * Returns a plain object representation of the Task instance.
   * Useful for serialization (e.g., JSON.stringify) or database insertion/update.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

    // Include related objects if they are present and have a toJSON method, or just include them directly.
    if (this.project) {
      json.project = typeof this.project.toJSON === 'function' ? this.project.toJSON() : this.project;
    }
    if (this.assignee) {
      json.assignee = typeof this.assignee.toJSON === 'function' ? this.assignee.toJSON() : this.assignee;
    }

    return json;
  }

  // region Laravel Eloquent Equivalents - TODOs for Node.js Domain Entity

  /**
   * TODO: Repository Integration
   * In Laravel, `Task::find(1)` or `$task->save()` uses Eloquent's ORM for data persistence.
   * In Node.js, you'd typically have a `TaskRepository` class (or service layer) responsible for all CRUD operations
   * and interaction with your chosen data storage (e.g., a SQL client, NoSQL driver).
   * Example methods on `TaskRepository`:
   *   `create(task: Task): Promise<Task>`
   *   `findById(id: string): Promise<Task | null>`
   *   `update(task: Task): Promise<Task>`
   *   `delete(id: string): Promise<void>`
   * The `Task` entity itself remains clean of persistence logic.
   */

  /**
   * TODO: Relationships (project(), assignee())
   * In Laravel, these methods return relationship builders (e.g., `BelongsTo`).
   * In Node.js domain entities, relationships are typically managed in a few ways:
   * 1. **Foreign Keys:** The `project_id` and `assigned_to` properties explicitly store the IDs.
   * 2. **Eager Loading:** Related entities (like `project` and `assignee`) can be loaded and attached to the `Task` instance's properties (`this.project`, `this.assignee`) during hydration (e.g., in `static from()`) by the repository if JOINs were performed.
   * 3. **Lazy Loading:** Implement methods on the entity (or, more commonly, a service/repository) that explicitly fetch related data when needed.
   *    Example (if `projectRepository` is available):
   *    `async getProject() { if (!this.project && this.project_id) { this.project = await projectRepository.findById(this.project_id); } return this.project; }`
   */

  /**
   * TODO: $fillable attributes (['project_id','title','description','status','assigned_to'])
   * In Laravel, `$fillable` protects against mass assignment vulnerabilities.
   * In Node.js, this concept translates to what attributes are explicitly accepted by the constructor and `static from()` method.
   * Mass assignment protection and data validation are typically handled in the application layer:
   * - **Data Transfer Objects (DTOs):** To explicitly define accepted input fields for creation/update.
   * - **Validation Schemas:** Using libraries like Joi or Zod to validate incoming data before hydrating the entity.
   * - **Repository/Service Methods:** Explicitly accepting and mapping only allowed fields.
   */

  /**
   * TODO: $casts attributes ({ 'status' => TaskStatus::class })
   * In Laravel, `$casts` automatically converts attributes to/from specified types (e.g., enum, datetime).
   * In Node.js, this conversion should happen explicitly:
   * - **In the `constructor`:** When creating a new instance with raw data.
   * - **In `static from()`:** When hydrating an instance from a plain object (e.g., database record).
   * We've added a JSDoc `@typedef` for `TaskStatus`. A robust implementation would involve a dedicated enum class/object with methods for validation and conversion.
   * Example (if `TaskStatusEnum` from the typedef example was used):
   *   `this.status = TaskStatusEnum.fromValue(status);` in constructor.
   *   `obj.status = TaskStatusEnum.fromValue(obj.status);` before `new Task(...)` in `static from()`.
   */

  /**
   * TODO: $hidden attributes (e.g., 'password')
   * In Laravel, `$hidden` specifies attributes that should not be included when the model is serialized to JSON.
   * In Node.js, this is handled within the `toJSON()` method by explicitly omitting or deleting sensitive properties.
   * For this model, no $hidden attributes were specified in Laravel, but if there were (e.g., a sensitive API key on a task),
   * `delete json.sensitiveProperty;` could be added to the `toJSON()` method.
   */

  // endregion
}


export default { Task };