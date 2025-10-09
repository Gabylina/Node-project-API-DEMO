// migrated from app/Services/TaskService.php

// TODO: Import TaskStatus from an enums module
const TaskStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
});

export class TaskService {
  /**
   * @param {object} deps
   * @param {object} deps.taskRepository - Repository for Task models. TODO: Define interface for TaskRepository.
   * @param {object} deps.projectRepository - Repository for Project models. TODO: Define interface for ProjectRepository.
   * @param {object} deps.eventBus - Event bus for dispatching events. TODO: Define interface for EventBus.
   */
  constructor(deps = {}) {
    this.deps = deps;
    this.taskRepository = deps.taskRepository;
    this.projectRepository = deps.projectRepository; // Might be useful for validation or relationship checks
    this.eventBus = deps.eventBus;

    if (!this.taskRepository) {
      throw new Error('TaskService requires a taskRepository.');
    }
    // ProjectRepository is not strictly used in current methods, but good to have for future extensions
    if (!this.eventBus) {
      console.warn('TaskService initialized without an eventBus. Events will not be dispatched.');
    }
  }

  /**
   * Lists tasks for a given project, with pagination and assignee eager loaded.
   * @param {string} projectId - The ID of the project.
   * @param {object} options
   * @param {number} [options.page=1] - The current page number.
   * @param {number} [options.limit=10] - The number of items per page.
   * @returns {Promise<object>} - A paginated list of tasks.
   * @throws {Error} If the project is not found.
   */
  async list(projectId, { page = 1, limit = 10 } = {}) {
    // TODO: Verify project existence if required (the PHP code assumes Project object is passed)
    // const project = await this.projectRepository.findById(projectId);
    // if (!project) {
    //   throw new Error(`Project with ID ${projectId} not found.`);
    // }

    // TODO: Implement a findByProjectIdWithAssigneePaginated method in TaskRepository
    // This method should handle eager loading 'assignee' and pagination.
    const tasks = await this.taskRepository.findByProjectIdPaginated(
      projectId,
      { page, limit, includeAssignee: true, orderBy: 'createdAt', orderDirection: 'desc' }
    );
    return tasks; // Repository should return a paginated structure {data: [...], meta: {...}}
  }

  /**
   * Creates a new task within a project.
   * @param {string} projectId - The ID of the project.
   * @param {object} data
   * @param {string} data.title - The title of the task.
   * @param {string} [data.description] - The description of the task.
   * @param {string} [data.assigned_to] - The ID of the user assigned to the task.
   * @returns {Promise<object>} The newly created task.
   * @throws {Error} If title is missing or project is not found.
   */
  async create(projectId, data) {
    if (!data.title) {
      throw new Error('Task title is required.');
    }

    // TODO: Verify project existence if required
    // const project = await this.projectRepository.findById(projectId);
    // if (!project) {
    //   throw new Error(`Project with ID ${projectId} not found.`);
    // }

    const taskData = {
      projectId: projectId,
      title: data.title,
      description: data.description ?? null,
      assigned_to: data.assigned_to ?? null, // Assuming 'assignedTo' for Node.js convention
      status: TaskStatus.PENDING, // Default status
    };

    // TODO: Implement a create method in TaskRepository that returns the fresh/created task object.
    const newTask = await this.taskRepository.create(taskData);
    return newTask;
  }

  /**
   * Updates an existing task.
   * @param {string} taskId - The ID of the task to update.
   * @param {object} data - The data to update the task with.
   * @returns {Promise<object>} The updated task.
   * @throws {Error} If the task is not found.
   */
  async update(taskId, data) {
    // TODO: Implement a findById method in TaskRepository
    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    const oldStatus = existingTask.status;

    // Prepare update data, converting assigned_to to assignedTo if necessary
    const updateData = {
      ...data,
      ...(data.assigned_to !== undefined && { assigned_to: data.assigned_to }),
    };
    // Remove original assigned_to if assignedTo is set for consistency
    delete updateData.assigned_to;

    // TODO: Implement an update method in TaskRepository that returns the fresh/updated task object.
    // This method should handle partial updates.
    const updatedTask = await this.taskRepository.update(taskId, updateData);

    if (this.eventBus && data.status !== undefined && oldStatus !== updatedTask.status) {
      // TODO: Define event name and payload structure consistently.
      // Example event name: 'task.status.updated'
      this.eventBus.dispatch('task.status.updated', { taskId: updatedTask.id, oldStatus, newStatus: updatedTask.status, task: updatedTask });
    }

    return updatedTask;
  }
}


export default { TaskService };