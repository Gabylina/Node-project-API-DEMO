// migrated from App/Services/TaskService.php

// TODO: Define TaskStatusEnum (e.g., in src/enums/TaskStatusEnum.js)
// export const TaskStatusEnum = {
//     PENDING: 'pending',
//     IN_PROGRESS: 'in_progress',
//     COMPLETED: 'completed',
//     CANCELLED: 'cancelled',
// };

export class TaskService {
    /**
     * @param {object} deps - Dependencies object
     * @param {object} deps.taskRepository - Repository for Task model operations
     * @param {object} [deps.projectRepository] - Repository for Project model operations (potentially, though less used directly here)
     * @param {object} [deps.eventBus] - Event bus for dispatching events
     * @param {object} deps.TaskStatusEnum - Enum for task statuses (e.g., PENDING, IN_PROGRESS)
     */
    constructor(deps = {}) {
        this.deps = deps;

        // Ensure essential dependencies are provided
        if (!this.deps.taskRepository) {
            throw new Error('TaskService requires a taskRepository dependency.');
        }
        if (!this.deps.TaskStatusEnum) {
            throw new Error('TaskService requires a TaskStatusEnum dependency.');
        }
        // eventBus is optional but recommended for dispatching events
        // projectRepository might be needed if creating tasks requires validating project existence more rigorously,
        // but for now, we assume `projectId` is valid.
    }

    /**
     * Lists tasks for a given project.
     * Corresponds to: public function list(Project $project)
     *
     * @param {string} projectId - The ID of the project.
     * @param {object} [options] - Pagination and filtering options.
     * @param {number} [options.page=1] - Current page number.
     * @param {number} [options.limit=10] - Number of items per page.
     * @returns {Promise<object>} - A paginated list of tasks (e.g., { data: [], meta: { total, page, limit } }).
     * @throws {Error} If projectId is missing.
     */
    async list(projectId, options = {}) {
        if (!projectId) {
            throw new Error('Project ID is required to list tasks.');
        }

        const { page = 1, limit = 10 } = options;

        // TODO: Replace with an actual call to taskRepository for fetching tasks associated with a project.
        // The original Laravel code used `$project->tasks()->with('assignee:id,name,email')->latest()->paginate(10);`
        // This implies:
        // 1. Filtering by projectId.
        // 2. Eager loading 'assignee' with specific fields.
        // 3. Ordering by creation date in descending order.
        // 4. Pagination.
        const tasks = await this.deps.taskRepository.findByProjectIdWithPagination(
            projectId,
            {
                page,
                limit,
                includeAssignee: true, // For the 'with('assignee')' part
                assigneeFields: ['id', 'name', 'email'], // For the 'assignee:id,name,email' part
                orderBy: { createdAt: 'desc' } // For the 'latest()' part
            }
        );

        return tasks;
    }

    /**
     * Creates a new task for a given project.
     * Corresponds to: public function create(Project $project, array $data): Task
     *
     * @param {string} projectId - The ID of the project.
     * @param {object} data - Task data.
     * @param {string} data.title - The title of the task.
     * @param {string} [data.description] - The description of the task.
     * @param {string} [data.assigned_to] - The ID of the user assigned to the task. (Note: snake_case for input, will be converted if needed for internal model/repo)
     * @returns {Promise<object>} - The newly created task object.
     * @throws {Error} If projectId or title is missing.
     */
    async create(projectId, data) {
        if (!projectId) {
            throw new Error('Project ID is required to create a task.');
        }
        if (!data || !data.title) {
            throw new Error('Task title is required.');
        }

        const newTaskData = {
            projectId: projectId,
            title: data.title,
            description: data.description ?? null,
            // Assuming assigned_to from input becomes assignedTo in the internal model/repository
            assigned_to: data.assigned_to ?? null,
            status: this.deps.TaskStatusEnum.PENDING,
        };

        // TODO: Ensure taskRepository.create returns the full, "fresh" created task object.
        const task = await this.deps.taskRepository.create(newTaskData);
        return task;
    }

    /**
     * Updates an existing task.
     * Corresponds to: public function update(Task $task, array $data): Task
     *
     * @param {string} taskId - The ID of the task to update.
     * @param {object} data - Data to update the task with.
     * @param {string} [data.title]
     * @param {string} [data.description]
     * @param {string} [data.assigned_to]
     * @param {string} [data.status] - The new status of the task.
     * @returns {Promise<object>} - The updated task object.
     * @throws {Error} If taskId is missing, no update data, or task not found.
     */
    async update(taskId, data) {
        if (!taskId) {
            throw new Error('Task ID is required to update a task.');
        }
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Update data is required.');
        }

        // Fetch the existing task to get its current status for event comparison
        const existingTask = await this.deps.taskRepository.findById(taskId);
        if (!existingTask) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }

        const oldStatus = existingTask.status;

        // Convert incoming snake_case keys (e.g., 'assigned_to') to camelCase for the repository
        const updatePayload = {};
        async for(const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                updatePayload[camelKey] = data[key];
            }
        }

        // TODO: Ensure taskRepository.update returns the full, "fresh" updated task object.
        const updatedTask = await this.deps.taskRepository.update(taskId, updatePayload);

        // Check if status was updated and if it actually changed, then dispatch event
        if (
            Object.prototype.hasOwnProperty.call(data, 'status') &&
            oldStatus !== updatedTask.status
        ) {
            // TODO: Dispatch TaskStatusUpdated event via an event bus.
            // The original PHP uses `TaskStatusUpdated::dispatch($task);`
            if (this.deps.eventBus && typeof this.deps.eventBus.publish === 'function') {
                this.deps.eventBus.publish({
                    type: 'TaskStatusUpdated',
                    payload: updatedTask,
                });
            } else {
                console.warn(`TODO: EventBus not configured for TaskService. Not dispatching TaskStatusUpdated for task ${updatedTask.id}.`);
            }
        }

        return updatedTask;
    }
}


export default { TaskService };