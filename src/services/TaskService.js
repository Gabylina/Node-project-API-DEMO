// migrated from app/Services/TaskService.php

/**
 * Represents the status of a task.
 * In a real application, this would likely be an imported Enum/constant.
 */
const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
};

export class TaskService {
  /**
   * @param {object} deps - Dependencies object.
   * @param {object} deps.taskRepository - Repository for Task operations (e.g., database access).
   * @param {object} [deps.eventBus] - Optional event bus for dispatching domain events.
   * @param {object} [deps.TaskStatus] - Optional: if TaskStatus is an external enum/constant source.
   */
  constructor(deps = {}) {
    this.deps = deps;
    // Use injected TaskStatus or the local definition if not provided
    this.TaskStatus = deps.TaskStatus || TaskStatus;
  }

  /**
   * Lists tasks for a given project.
   * Equivalent to Laravel's $project->tasks()->with('assignee:id,name,email')->latest()->paginate(10).
   *
   * @param {object} project - The project object (must have an 'id' property).
   * @returns {Promise<Array<object>>} A promise that resolves to an array of task objects.
   * @throws {Error} If TaskRepository is missing or project ID is invalid.
   */
  async list(project) {
    if (!this.deps.taskRepository) {
      throw new Error('TaskService requires a "taskRepository" dependency.');
    }
    if (!project || !project.id) {
      throw new Error('Invalid project object provided. It must have an "id" property.');
    }

    // TODO: The Laravel paginate(10) returns a paginated object. This migration assumes the repository
    // handles pagination internally or returns a simple array for now. Adjust as per actual repository design.
    const tasks = await this.deps.taskRepository.findMany({
      projectId: project.id,
      includeAssignee: true, // Placeholder to indicate loading related 'assignee'
      orderBy: { createdAt: 'desc' },
      limit: 10,
      // page: 1, // Or skip/take depending on your pagination strategy
    });

    return tasks;
  }

  /**
   * Creates a new task for a given project.
   *
   * @param {object} project - The project object (must have an 'id' property).
   * @param {object} data - Task data (e.g., { title: string, description?: string, assigned_to?: string }).
   * @returns {Promise<object>} A promise that resolves to the created task object.
   * @throws {Error} If TaskRepository is missing, project ID is invalid, or title is missing.
   */
  async create(project, data) {
    if (!this.deps.taskRepository) {
      throw new Error('TaskService requires a "taskRepository" dependency.');
    }
    if (!project || !project.id) {
      throw new Error('Invalid project object provided. It must have an "id" property.');
    }
    if (!data || !data.title) {
      throw new Error('Title is required to create a task.');
    }

    const newTaskData = {
      projectId: project.id,
      title: data.title,
      description: data.description ?? null,
      assigneeId: data.assigned_to ?? null, // Renamed 'assigned_to' to 'assigneeId' for Node.js convention
      status: this.TaskStatus.PENDING,
    };

    const createdTask = await this.deps.taskRepository.create(newTaskData);
    // Laravel's fresh() reloads the model to ensure all attributes/relations are present.
    // Here, we assume the repository's create method returns the complete, newly created object.
    return createdTask;
  }

  /**
   * Updates an existing task.
   * Dispatches a 'TaskStatusUpdated' event if the status changes.
   *
   * @param {object} task - The task object to update (must have an 'id' property).
   * @param {object} data - The data to update (e.g., { title?: string, status?: string }).
   * @returns {Promise<object>} A promise that resolves to the updated task object.
   * @throws {Error} If TaskRepository is missing, task ID is invalid, or update data is empty.
   */
  async update(task, data) {
    if (!this.deps.taskRepository) {
      throw new Error('TaskService requires a "taskRepository" dependency.');
    }
    if (!task || !task.id) {
      throw new Error('Invalid task object provided. It must have an "id" property.');
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data is required to update a task.');
    }

    const oldStatus = task.status;
    // Assuming task is a plain object and its ID is used for the update.
    const updatedTask = await this.deps.taskRepository.update(task.id, data);

    // Check if 'status' was explicitly provided in the update data and if its value actually changed.
    if (Object.prototype.hasOwnProperty.call(data, 'status') && oldStatus !== updatedTask.status) {
      if (this.deps.eventBus) {
        // TODO: Ensure eventBus.publish is an async operation if needed, or handle as fire-and-forget.
        await this.deps.eventBus.publish('TaskStatusUpdated', updatedTask);
      } else {
        console.warn(`TODO: EventBus dependency is missing. 'TaskStatusUpdated' event not dispatched for Task ID: ${updatedTask.id}.`);
      }
    }
    // Assuming the repository returns the fresh, updated object.
    return updatedTask;
  }
}


export default { TaskService };