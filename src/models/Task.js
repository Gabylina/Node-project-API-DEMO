// migrated from app/Models/Task.php
// This file represents a clean domain entity in Node.js (ESM),
// decoupled from any specific ORM or database layer.

/**
 * Represents a Task entity.
 * @typedef {'pending'|'in_progress'|'completed'|'cancelled'} TaskStatusEnum
 */

export class Task {
    /** @type {string|null} */
    id;
    /** @type {string|null} */
    project_id; // Corresponds to Laravel's project_id, kept for direct DB column mapping without ORM.
    /** @type {string|null} */
    title;
    /** @type {string|null} */
    description;
    /** @type {TaskStatusEnum} */
    status; // Corresponds to Laravel's TaskStatus enum.
    /** @type {string|null} */
    assigned_to; // Corresponds to Laravel's assigned_to, kept for direct DB column mapping without ORM.
    /** @type {Date|null} */
    createdAt;
    /** @type {Date|null} */
    updatedAt;

    /**
     * Creates an instance of Task.
     * @param {object} props - The properties to initialize the task with.
     * @param {string|null} [props.id=null]
     * @param {string|null} [props.project_id=null]
     * @param {string|null} [props.title=null]
     * @param {string|null} [props.description=null]
     * @param {TaskStatusEnum} [props.status='pending'] - Default status, can be refined based on TaskStatusEnum definition.
     * @param {string|null} [props.assigned_to=null]
     * @param {Date|string|null} [props.createdAt=null]
     * @param {Date|string|null} [props.updatedAt=null]
     */
    constructor({
        id = null,
        project_id = null,
        title = null,
        description = null,
        status = 'pending', // Defaulting to 'pending' as a common initial state. TODO: Validate against TaskStatusEnum.
        assigned_to = null,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.project_id = project_id;
        this.title = title;
        this.description = description;
        this.status = status; // TODO: Implement strict validation/casting for TaskStatusEnum here or in 'from' method.
        this.assigned_to = assigned_to;
        this.createdAt = createdAt ? new Date(createdAt) : null;
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    }

    /**
     * Creates a Task instance from a plain object (e.g., from a database row or API payload).
     * Handles potential variations in property names (snake_case from DB, camelCase from JS objects)
     * and basic type casting for dates.
     * @param {object} obj - The plain object to convert.
     * @returns {Task} A new Task instance.
     */
    static from(obj) {
        // TODO: Implement robust validation for 'status' against a defined TaskStatus enum.
        // If an explicit TaskStatus enum class/object is defined, import it and use it here.
        const props = {
            id: obj.id ?? null,
            project_id: obj.project_id ?? obj.projectId ?? null, // Allows snake_case (DB) or camelCase (JS) input
            title: obj.title ?? null,
            description: obj.description ?? null,
            status: obj.status ?? 'pending', // Default if not provided. TODO: Ensure it's a valid TaskStatusEnum member.
            assigned_to: obj.assigned_to ?? obj.assignedTo ?? null, // Allows snake_case (DB) or camelCase (JS) input
            createdAt: obj.created_at ?? obj.createdAt ?? null,
            updatedAt: obj.updated_at ?? obj.updatedAt ?? null,
        };
        return new Task(props);
    }

    /**
     * Converts the Task instance to a plain object suitable for serialization (e.g., to JSON or database storage).
     * Keeps property names consistent with typical database column names (snake_case where appropriate).
     * @returns {object} A plain object representation of the Task.
     */
    toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
    }

    // --- Laravel Eloquent Equivalents (TODOs for Node.js Domain Entities without ORM) ---

    /**
     * TODO: Implement Task Repository for data persistence (CRUD operations).
     * In a Node.js domain, you would typically have a `TaskRepository` class
     * responsible for interacting with the database directly (e.g., using a PG client, MongoDB driver).
     * Methods like `save(task)`, `findById(id)`, `delete(id)` would reside in the repository.
     * Example usage:
     *

export default { Task };