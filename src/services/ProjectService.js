// migrated from App/Services/ProjectService.php
export class ProjectService {
  constructor(deps = {}) {
    this.deps = deps;
    // Ensure core dependencies are provided
    if (!this.deps.projectRepository) {
      throw new Error('ProjectRepository dependency is required for ProjectService.');
    }
    // EventBus is used for dispatching events; if not provided, events won't be dispatched.
    if (!this.deps.eventBus) {
      console.warn('EventBus dependency is missing for ProjectService. ProjectCreated events will not be dispatched.');
    }
  }

  /**
   * Lists projects for a given user.
   * @param {object} user - The user object, expected to have an 'id' property (e.g., { id: 123 }).
   * @returns {Promise<object[]>} - A promise that resolves to a paginated list of project objects or a data/meta object.
   * @throws {Error} If the projectRepository operation fails.
   */
  async listFor(user) {
    // TODO: Replace Laravel's ORM pagination and relations with projectRepository method.
    // Original Laravel: Project::query()->where('user_id', $user->id)->withCount('tasks')->latest()->paginate(10);

    try {
      // This assumes `projectRepository` has a method to list projects with filtering, pagination, and relation counts.
      // The exact arguments and return structure might need adjustment based on your repository implementation.
      const projects = await this.deps.projectRepository.findByUserId(user.id, {
        page: 1, // Default page for pagination
        limit: 10, // Default limit for pagination
        includeTasksCount: true, // For `withCount('tasks')`
        sortBy: 'createdAt', // For `latest()` assuming it means order by creation date descending
        sortOrder: 'desc'
      });
      return projects;
    } catch (error) {
      console.error(`ProjectService.listFor failed for user ${user?.id}:`, error);
      throw new Error(`Could not list projects: ${error.message}`);
    }
  }

  /**
   * Creates a new project for a user.
   * @param {object} user - The user object, expected to have an 'id' property (e.g., { id: 123 }).
   * @param {object} data - The project data (e.g., { name: 'My Project', description: '...' }).
   * @returns {Promise<object>} - A promise that resolves to the newly created project object.
   * @throws {Error} If the projectRepository fails or event dispatch fails (if eventBus throws).
   */
  async createFor(user, data) {
    // TODO: Replace Laravel's ORM `Project::create` with `projectRepository.create`.
    // Original Laravel: $project = Project::create([...]);

    try {
      const projectData = {
        user_id: user.id,
        name: data.name,
        description: data.description ?? null, // Handle null coalesce for optional description
      };

      const newProject = await this.deps.projectRepository.create(projectData);

      // TODO: Replace Laravel's `ProjectCreated::dispatch($project)` with `eventBus.dispatch`.
      if (this.deps.eventBus) {
        await this.deps.eventBus.dispatch('ProjectCreated', newProject);
      } else {
        // This warning is already in the constructor, but can be repeated here if preferred.
        // console.warn('EventBus not available, ProjectCreated event not dispatched.');
      }

      // Laravel's `->fresh()` ensures the model is reloaded from the database, often to get default values, timestamps, or relations.
      // In a Node.js repository pattern, the `create` method should typically return the fully hydrated new entity.
      return newProject;
    } catch (error) {
      console.error(`ProjectService.createFor failed for user ${user?.id} with data ${JSON.stringify(data)}:`, error);
      throw new Error(`Could not create project: ${error.message}`);
    }
  }

  /**
   * Updates an existing project.
   * @param {object} project - The project object to update, expected to have an 'id' property (e.g., { id: 456, ... }).
   * @param {object} data - The data to update the project with (e.g., { name: 'Updated Name' }).
   * @returns {Promise<object>} - A promise that resolves to the updated project object.
   * @throws {Error} If the projectRepository operation fails.
   */
  async update(project, data) {
    // TODO: Replace Laravel's ORM `$project->update($data)` with `projectRepository.update`.
    // Original Laravel: $project->update($data); return $project->fresh();

    try {
      // Ensure the project object has an ID for updating.
      if (!project || !project.id) {
        throw new Error('Invalid project object provided for update: missing ID.');
      }

      const updatedProject = await this.deps.projectRepository.update(project.id, data);

      // Similar to `createFor`, `->fresh()` behavior is assumed to be handled by the repository returning the full, updated entity.
      return updatedProject;
    } catch (error) {
      console.error(`ProjectService.update failed for project ${project?.id} with data ${JSON.stringify(data)}:`, error);
      throw new Error(`Could not update project: ${error.message}`);
    }
  }
}


export default { ProjectService };