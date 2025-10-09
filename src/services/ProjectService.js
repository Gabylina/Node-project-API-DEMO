// migrated from app/Services/ProjectService.php

export class ProjectService {
  /**
   * @param {object} deps - Dependencies object.
   * @param {object} deps.projectRepository - An object with methods for project data access (e.g., find, create, update).
   * @param {object} deps.userRepository - An object with methods for user data access.
   * @param {object} deps.eventBus - An object with a 'dispatch' method for emitting events.
   */
  constructor(deps = {}) {
    this.deps = deps;

    // Ensure required repositories and event bus are provided
    if (!this.deps.projectRepository) {
      console.warn('ProjectService: projectRepository dependency is missing. Some methods may not function correctly.');
    }
    if (!this.deps.eventBus) {
      console.warn('ProjectService: eventBus dependency is missing. Events will not be dispatched.');
    }
  }

  /**
   * Lists projects for a given user, paginated and with task counts.
   * @param {object} user - The user object (e.g., { id: 'uuid-user-123', ... }).
   * @param {object} [options] - Pagination and sorting options.
   * @param {number} [options.page=1] - The current page number.
   * @param {number} [options.perPage=10] - The number of items per page.
   * @returns {Promise<object> | never} A promise that resolves to a paginated list of projects.
   * @throws {Error} If the project repository is not configured.
   */
  async listFor(user, options = {}) {
    if (!this.deps.projectRepository) {
      throw new Error('ProjectService: projectRepository is not configured.');
    }
    if (!user || !user.id) {
      throw new Error('ProjectService: Invalid user object provided.');
    }

    const { page = 1, perPage = 10 } = options;
    const userId = user.id;

    // TODO: Replace with actual project repository call.
    // The PHP `paginate(10)` implies pagination. `withCount('tasks')` implies fetching task counts.
    // The repository method should handle these concerns.
    // Example: `this.deps.projectRepository.findByUserIdPaginated(userId, { page, perPage, withTasksCount: true, orderBy: 'latest' });`
    console.log(`TODO: Fetch projects for user ${userId} with task count, paginated (page: ${page}, perPage: ${perPage}).`);

    // Mock response for demonstration
    return {
      data: [],
      meta: { currentPage: page, perPage: perPage, total: 0 }
    };
  }

  /**
   * Creates a new project for a given user.
   * @param {object} user - The user object (e.g., { id: 'uuid-user-123', ... }).
   * @param {object} data - The project data (e.g., { name: 'New Project', description: '...' }).
   * @param {string} data.name - The name of the project. (Required)
   * @param {string} [data.description] - The description of the project.
   * @returns {Promise<object> | never} A promise that resolves to the newly created project object.
   * @throws {Error} If the project name is missing, or repositories/event bus are not configured.
   */
  async createFor(user, data) {
    if (!this.deps.projectRepository) {
      throw new Error('ProjectService: projectRepository is not configured.');
    }
    if (!this.deps.eventBus) {
      throw new Error('ProjectService: eventBus is not configured.');
    }
    if (!user || !user.id) {
      throw new Error('ProjectService: Invalid user object provided.');
    }
    if (!data || !data.name) {
      throw new Error('ProjectService: Project name is required.');
    }

    const userId = user.id;
    const projectData = {
      user_id: userId, // Using camelCase for Node.js, repository should map to 'user_id' if needed
      name: data.name,
      description: data.description || null, // PHP's `?? null` equivalent
      // Add other default fields like 'createdAt', 'updatedAt' which usually handled by repository/ORM
    };

    // TODO: Call project repository to create the project.
    // The repository should return the full created project object, including its generated ID and default values.
    const project = await this.deps.projectRepository.create(projectData);

    // `ProjectCreated::dispatch($project)` becomes an event bus dispatch.
    await this.deps.eventBus.dispatch('ProjectCreated', project);

    // PHP's `->fresh()` reloads the model. In a repository pattern, `create` should return the fresh object.
    return project;
  }

  /**
   * Updates an existing project.
   * @param {object} project - The project object to update (e.g., { id: 'uuid-project-123', ... }).
   * @param {object} data - The data to update (e.g., { name: 'Updated Name', description: '...' }).
   * @param {string} [data.name] - The new name of the project.
   * @param {string} [data.description] - The new description of the project.
   * @returns {Promise<object> | never} A promise that resolves to the updated project object.
   * @throws {Error} If the project object is invalid or the project repository is not configured.
   */
  async update(project, data) {
    if (!this.deps.projectRepository) {
      throw new Error('ProjectService: projectRepository is not configured.');
    }
    if (!project || !project.id) {
      throw new Error('ProjectService: Invalid project object provided for update.');
    }

    // Filter data to only allowed update fields for security and clarity.
    // This ensures only specific fields can be updated through this method.
    const updatableFields = ['name', 'description']; 
    const updatePayload = {};
    async for(const field of updatableFields) {
      if (data[field] !== undefined) {
        updatePayload[field] = data[field];
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      // No valid fields to update, return the original project or throw an error.
      // For now, return the original project object to indicate no changes were applied.
      return project;
    }

    // TODO: Call project repository to update the project.
    // The repository method should use `project.id` to identify the record and apply `updatePayload`.
    const updatedProject = await this.deps.projectRepository.update(project.id, updatePayload);

    // PHP's `->fresh()` reloads the model. In a repository pattern, `update` should return the fresh updated object.
    return updatedProject;
  }
}


export default { ProjectService };