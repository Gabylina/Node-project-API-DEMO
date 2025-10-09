// migrated from app/Services/TaskService.php

// TODO: Consider moving TaskStatus to a separate constants or enums file (e.g., `src/enums/TaskStatus.js`)
// and importing it: `import { TaskStatus } from '../enums/TaskStatus.js';`
const TaskStatus = {
  PENDING: 'pending',
  // Add other statuses if known from PHP enum, e.g., 'completed', 'in-progress'
  // COMPLETED: 'completed',
  // IN_PROGRESS: 'in-progress',
};

export class TaskService {
  /**
   * Initializes the TaskService with necessary dependencies.
   * @param {object} deps - An object containing service dependencies.
   * @param {object} deps.taskRepository - Repository for Task data operations.
   * @param {object} [deps.eventBus] - Optional event bus for dispatching events.
   */
  constructor(deps = {}) {
    this.deps = deps;

    if (!this.deps.taskRepository) {
      throw new Error('TaskService: taskRepository dependency is required.');
    }
    // If eventBus is mandatory for some operations, add a check here:
    // if (!this.deps.eventBus) {
    //   throw new Error('TaskService: eventBus dependency is required.');
    // }
  }

  /**
   * Lists tasks for a specific project with pagination and eager loaded assignee.
   * @param {object} project - The project object. Assumed to have an 'id' property.
   * @param {object} [options] - Options for listing tasks.
   * @param {number} [options.page=1] - The page number for pagination.
   * @param {number} [options.limit=10] - The number of items per page for pagination.
   * @returns {Promise<object>} - A promise that resolves to a paginated list of tasks.
   *                                  (e.g., { data: [], meta: { currentPage, totalPages, totalItems, ... } })
   */
  async list(project, options = { page: 1, limit: 10 }) {
    if (!project || !project.id) {
      throw new Error('TaskService: Project object with an "id" property is required to list tasks.');
    }

    // TODO: Replace with actual `taskRepository` call.
    // The `taskRepository` would abstract the data access logic, handling:
    // - Filtering tasks by `projectId`.
    // - Eager loading related `assignee` information (simulating `with('assignee:id,name,email')`).
    // - Ordering by creation date descending (simulating `latest()`).
    // - Implementing pagination (simulating `paginate(10)`).
    const tasks = await this.deps.taskRepository.findByProjectId(project.id, {
      page: options.page,
      limit: options.limit,
      populate: ['assignee'], // Simulate eager loading
      orderBy: { field: 'createdAt', direction: 'desc' } // Simulate `latest()`
    });

    return tasks; // Expected to return a paginated object similar to Laravel's `paginate` output
  }

  /**
   * Creates a new task for a given project.
   * @param {object} project - The project object. Assumed to have an 'id' property.
   * @param {object} data - Task data for creation.
   * @param {string} data.title - The title of the task.
   * @param {string} [data.description] - The description of the task.
   * @param {string} [data.assigned_to] - The ID of the user assigned to the task (PHP snake_case convention).
   * @returns {Promise<object>} - A promise that resolves to the newly created task object.
   */
  async create(project, data) {
    if (!project || !project.id) {
      throw new Error('TaskService: Project object with an "id" property is required to create a task.');
    }
    if (!data || !data.title) {
      throw new Error('TaskService: "title" is required to create a task.');
    }

    const taskData = {
      projectId: project.id,
      title: data.title,
      description: data.description ?? null,
      assigned_to: data.assigned_to ?? null, // Converted from PHP's snake_case 'assigned_to' to Node.js's camelCase 'assignedTo'
      status: TaskStatus.PENDING,
      // Add any other default fields here (e.g., createdBy, creationDate, etc.)
    };

    // TODO: Replace with actual `taskRepository` call.
    // The repository should handle the actual data persistence and return the complete, newly created task entity.
    const createdTask = await this.deps.taskRepository.create(taskData);

    // Laravel's `fresh()` method reloads the model from the database to get the latest state.
    // In Node.js, a `create` operation from a well-designed repository typically returns
    // the fully hydrated (complete) model, making an explicit `fresh()` equivalent unnecessary.
    return createdTask;
  }

  /**
   * Updates an existing task.
   * @param {object} task - The task object to update. Assumed to have 'id' and 'status' properties.
   * @param {object} data - The data to update (e.g., title, description, assigned_to, status).
   * @returns {Promise<object>} - A promise that resolves to the updated task object.
   */
  async update(task, data) {
    if (!task || !task.id) {
      throw new Error('TaskService: Task object with an "id" property is required to update.');
    }
    if (Object.keys(data).length === 0) {
      throw new Error('TaskService: No data provided for update.');
    }

    const oldStatus = task.status;
    const updateData = { ...data }; // Create a shallow copy to safely modify input data

    // Convert PHP's snake_case 'assigned_to' to Node.js's camelCase 'assignedTo' if present
    if (Object.prototype.hasOwnProperty.call(updateData, 'assigned_to')) {
      updateData.assignedTo = updateData.assigned_to;
      delete updateData.assigned_to;
    }

    // TODO: Replace with actual `taskRepository` call.
    // The repository should handle the update logic and return the complete, updated task entity.
    const updatedTask = await this.deps.taskRepository.update(task.id, updateData);

    // Check if the 'status' field was updated and if its value actually changed
    if (
      Object.prototype.hasOwnProperty.call(data, 'status') &&
      oldStatus !== updatedTask.status
    ) {
      // TODO: Replace with actual `eventBus` dispatch.
      // Simulate `TaskStatusUpdated::dispatch($task)`.
      // Ensure `eventBus` is injected and has a `dispatch` method.
      if (this.deps.eventBus && typeof this.deps.eventBus.dispatch === 'function') {
        await this.deps.eventBus.dispatch('taskStatusUpdated', updatedTask);
      } else {
        // Log a warning if the event bus is not available but an event was supposed to be dispatched.
        console.warn('TaskService: eventBus dependency not provided or dispatch method is missing. TaskStatusUpdated event not dispatched.');
      }
    }

    // Similar to `create`, `fresh()` is generally not needed if the repository returns
    // the fully updated entity after the update operation.
    return updatedTask;
  }
}

// Optional: Export TaskStatus if it's considered part of the service's public API
export { TaskStatus };


export default { TaskService };