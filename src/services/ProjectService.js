// migrated from app/Services/ProjectService.php
export class ProjectService {
  constructor(deps = {}) {
    // Expected dependencies to be injected:
    // deps.projectRepository: An object with methods like `find`, `create`, `update`, `paginateForUser`.
    // deps.eventBus: An object with a `dispatch` method for events.
    this.deps = deps;

    // Basic validation for critical dependencies
    if (!this.deps.projectRepository) {
      console.warn("ProjectService: projectRepository dependency not provided. Data operations may fail.");
    }
    if (!this.deps.eventBus) {
      console.warn("ProjectService: eventBus dependency not provided. Events will not be dispatched.");
    }
  }

  /**
   * Lists projects for a given user, with pagination.
   * @param {string|number} userId - The ID of the user.
   * @param {object} [paginationOptions] - Options for pagination.
   * @param {number} [paginationOptions.page=1] - The current page number.
   * @param {number} [paginationOptions.limit=10] - The number of items per page.
   * @returns {Promise<object>} A paginated list of projects, including task counts.
   * @throws {Error} If projectRepository is not available or its required method is missing.
   */
  async listFor(userId, paginationOptions = { page: 1, limit: 10 }) {
    if (!this.deps.projectRepository || typeof this.deps.projectRepository.paginateForUser !== 'function') {
      throw new Error("ProjectService: projectRepository or paginateForUser method is not available.");
    }
    if (!userId) {
      throw new Error("User ID is required to list projects.");
    }

    // TODO: Implement a ProjectRepository to handle data access.
    // The original PHP code was: `Project::query()->where('user_id', $user->id)->withCount('tasks')->latest()->paginate(10);`
    // This implies a repository method that handles filtering by user, counting related tasks, ordering, and pagination.
    const projects = await this.deps.projectRepository.paginateForUser(
      userId,
      paginationOptions.page,
      paginationOptions.limit,
      { withCount: 'tasks', orderBy: { field: 'createdAt', direction: 'desc' } }
    );

    return projects;
  }

  /**
   * Creates a new project for a user.
   * @param {string|number} userId - The ID of the user for whom to create the project.
   * @param {object} data - Project data.
   * @param {string} data.name - The name of the project.
   * @param {string} [data.description] - The description of the project (optional).
   * @returns {Promise<object>} The newly created project object.
   * @throws {Error} If projectRepository is not available, data is invalid, or creation fails.
   */
  async createFor(userId, data) {
    if (!this.deps.projectRepository || typeof this.deps.projectRepository.create !== 'function') {
      throw new Error("ProjectService: projectRepository or create method is not available.");
    }
    if (!userId) {
      throw new Error("User ID is required to create a project.");
    }
    if (!data || !data.name) {
      throw new Error("Project name is required to create a project.");
    }

    // TODO: Implement a ProjectRepository to handle data creation.
    // The original PHP code was: `Project::create(['user_id' => $user->id, 'name' => $data['name'], 'description' => $data['description'] ?? null]);`
    const projectData = {
      user_id: userId,
      name: data.name,
      description: data.description || null, // Handle null/undefined description
    };

    const newProject = await this.deps.projectRepository.create(projectData);

    if (!newProject) {
        throw new Error("Failed to create project.");
    }

    // TODO: Implement an EventBus to dispatch events.
    // The original PHP code was: `ProjectCreated::dispatch($project);`
    if (this.deps.eventBus && typeof this.deps.eventBus.dispatch === 'function') {
      await this.deps.eventBus.dispatch('project.created', { project: newProject });
    } else {
      console.warn("ProjectService: EventBus not available, 'project.created' event not dispatched.");
    }

    // In Laravel, `$project->fresh()` reloads the model. Assuming `create` returns the fully persisted object.
    return newProject;
  }

  /**
   * Updates an existing project.
   * @param {string|number} projectId - The ID of the project to update.
   * @param {object} data - The data to update (e.g., name, description).
   * @returns {Promise<object>} The updated project object.
   * @throws {Error} If projectRepository is not available, projectId is missing, data is empty, or update fails.
   */
  async update(projectId, data) {
    if (!this.deps.projectRepository || typeof this.deps.projectRepository.update !== 'function') {
      throw new Error("ProjectService: projectRepository or update method is not available.");
    }
    if (!projectId) {
      throw new Error("Project ID is required to update a project.");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Update data is required for project update.");
    }

    // TODO: Implement a ProjectRepository to handle data updates.
    // The original PHP code was: `$project->update($data);`
    const updatedProject = await this.deps.projectRepository.update(projectId, data);

    if (!updatedProject) {
      throw new Error(`Project with ID ${projectId} not found or could not be updated.`);
    }

    // In Laravel, `$project->fresh()` reloads the model. Assuming `update` returns the fully persisted object.
    return updatedProject;
  }
}


export default { ProjectService };