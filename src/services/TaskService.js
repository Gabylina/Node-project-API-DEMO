// migrated from app/Services/TaskService.php

// TODO: Consider defining TaskStatus enum/constants in a separate file (e.g., enums/TaskStatus.js)
const TaskStatus = {
  PENDING: 'pending',
  // Add other statuses if known, e.g.,
  // IN_PROGRESS: 'in_progress',
  // COMPLETED: 'completed',
  // CANCELED: 'canceled',
};

export class TaskService {
  /**
   * @param {Object} deps - Dependencies for the service.
   * @param {Object} deps.taskRepository - Repository for Task model operations.
   * @param {Object} deps.eventBus - Event bus for dispatching events.
   */
  constructor(deps = {}) {
    this.deps = deps;

    if (!this.deps.taskRepository) {
      throw new Error('TaskService requires taskRepository dependency.');
    }
    // eventBus is optional for list/create, but required for update if status changes.
  }

  /**
   * Retrieves a paginated list of tasks for a given project.
   * @param {Object} project - The project object (or its ID).
   * @param {number} project.id - The ID of the project.
   * @returns {Promise<Object>} - A promise that resolves to a paginated list of tasks.
   */
  async list(project) {
    if (!project || !project.id) {
      throw new Error('Project object with an ID is required to list tasks.');
    }

    // TODO: Implement taskRepository.findPaginatedByProjectId to fetch tasks.
    // This method should handle eager loading ('assignee') and pagination.
    // Example: this.deps.taskRepository.findPaginatedByProjectId(
    //   project.id,
    //   { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', populate: ['assignee'] }
    // );
    console.warn("TODO: Implement taskRepository.findPaginatedByProjectId for task listing with assignee and pagination.");

    // Placeholder return structure simulating Laravel's paginate output
    return {
      data: [], // Array of task objects
      meta: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 0,
        // ... other pagination metadata
      }
    };
  }

  /**
   * Creates a new task within a specific project.
   * @param {Object} project - The project object (or its ID) where the task will be created.
   * @param {number} project.id - The ID of the project.
   * @param {Object} data - The data for the new task.
   * @param {string} data.title - The title of the task (required).
   * @param {string} [data.description] - The description of the task.
   * @param {string} [data.assigned_to] - The ID of the user assigned to the task (snake_case from PHP).
   * @returns {Promise<Object>} - A promise that resolves to the newly created task object.
   * @throws {Error} If title is missing or task creation fails.
   */
  async create(project, data) {
    if (!project || !project.id) {
      throw new Error('Project object with an ID is required to create a task.');
    }
    if (!data || !data.title) {
      throw new Error('Task title is required.');
    }

    const newTaskData = {
      projectId: project.id, // Link to the project
      title: data.title,
      description: data.description || null,
      // Note: PHP uses snake_case ('assigned_to'), Node.js typically uses camelCase.
      // Assuming the repository expects camelCase here or handles the conversion.
      assigned_to: data.assigned_to || null, // Converting from snake_case to camelCase
      status: TaskStatus.PENDING,
      // TODO: Add any other default fields like `createdAt`, `updatedAt` if not handled by repository.
    };

    // TODO: Implement taskRepository.create to persist the new task.
    // This method should return the newly created task object from the database, including its ID and default values.
    const createdTask = await this.deps.taskRepository.create(newTaskData);

    if (!createdTask) {
      throw new Error('Failed to create task.');
    }

    return createdTask;
  }

  /**
   * Updates an existing task.
   * @param {Object} task - The existing task object to be updated.
   * @param {number} task.id - The ID of the task.
   * @param {string} task.status - The current status of the task.
   * @param {Object} data - The update data for the task.
   * @param {string} [data.title] - New title for the task.
   * @param {string} [data.description] - New description for the task.
   * @param {string} [data.assigned_to] - New user ID assigned to the task.
   * @param {string} [data.status] - New status for the task.
   * @returns {Promise<Object>} - A promise that resolves to the updated task object.
   * @throws {Error} If task update fails.
   */
  async update(task, data) {
    if (!task || !task.id) {
      throw new Error('Task object with an ID is required for update.');
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data is required.');
    }

    const oldStatus = task.status;

    const updateData = {
      // Only include fields that are present in `data` to allow partial updates.
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.assigned_to !== undefined && { assigned_to: data.assigned_to }), // Convert from snake_case
      ...(data.status !== undefined && { status: data.status }),
      // TODO: Add any other fields that can be updated.
    };

    // TODO: Implement taskRepository.update to persist the changes.
    // This method should update the task in the database and return the updated task object.
    const updatedTask = await this.deps.taskRepository.update(task.id, updateData);

    if (!updatedTask) {
      throw new Error('Failed to update task.');
    }

    // Check if status was updated and changed
    if (Object.prototype.hasOwnProperty.call(data, 'status') && oldStatus !== updatedTask.status) {
      if (this.deps.eventBus) {
        // TODO: Define the event name and payload structure consistently (e.g., 'task:status-updated').
        this.deps.eventBus.emit('TaskStatusUpdated', updatedTask);
      } else {
        console.warn(`TODO: EventBus is not available. Could not emit 'TaskStatusUpdated' for task ID ${updatedTask.id}`);
      }
    }

    return updatedTask;
  }
}


export default { TaskService };