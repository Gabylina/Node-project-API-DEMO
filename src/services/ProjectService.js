// migrated from app/Services/ProjectService.php

// TODO: Define ProjectCreatedEvent (e.g., in src/events/ProjectCreatedEvent.js)
// class ProjectCreatedEvent { constructor(project) { this.project = project; } }

export class ProjectService {
  /**
   * @param {object} deps
   * @param {object} deps.projectRepository - Instance of a ProjectRepository (e.g., from src/repositories/ProjectRepository.js)
   * @param {object} deps.userRepository - Instance of a UserRepository (e.g., from src/repositories/UserRepository.js)
   * @param {object} deps.eventBus - Instance of an EventBus (e.g., from src/events/EventBus.js)
   * @param {Function} deps.ProjectCreatedEvent - The constructor for the ProjectCreated event
   */
  constructor(deps = {}) {
    this.deps = deps;
    if (!this.deps.projectRepository) {
      throw new Error('ProjectRepository is required for ProjectService');
    }
    if (!this.deps.userRepository) {
      throw new Error('UserRepository is required for ProjectService');
    }
    if (!this.deps.eventBus) {
      throw new Error('EventBus is required for ProjectService');
    }
    if (!this.deps.ProjectCreatedEvent) {
      throw new Error('ProjectCreatedEvent is required for ProjectService');
    }
  }

  /**
   * Lists projects for a given user, paginated.
   * @param {object} user - The user object (e.g., { id: 'uuid-user-1' })
   * @returns {Promise<object[]>} A promise that resolves to an array of project objects, potentially with task counts.
   * @throws {Error} If the database operation fails.
   */
  async listFor(user) {
    // TODO: Implement ProjectRepository.findManyByUserIdWithTaskCountPaginated method
    // This method should handle pagination, filtering by user_id, and eager-loading/counting tasks.
    return await this.deps.projectRepository.findManyByUserIdWithTaskCountPaginated(
      user.id, 
      10, // itemsPerPage
      { orderBy: 'createdAt', orderDirection: 'desc' } // or 'latest'
    );
  }

  /**
   * Creates a new project for a user.
   * @param {object} user - The user object (e.g., { id: 'uuid-user-1' })
   * @param {object} data - Project data (e.g., { name: 'New Project', description: '...' })
   * @param {string} data.name - The project name.
   * @param {string} [data.description] - The project description.
   * @returns {Promise<object>} A promise that resolves to the newly created project object.
   * @throws {Error} If project creation fails (e.g., due to validation or database error).
   */
  async createFor(user, data) {
    const projectData = {
      user_id: user.id,
      name: data.name,
      description: data.description ?? null,
    };

    // TODO: Implement ProjectRepository.create method to save the project to the database.
    // This method should ideally return the fully hydrated project object.
    const project = await this.deps.projectRepository.create(projectData);

    // Dispatch an event indicating the project was created
    await this.deps.eventBus.dispatch(new this.deps.ProjectCreatedEvent(project));
    
    return project;
  }

  /**
   * Updates an existing project.
   * @param {object} project - The project object to update (e.g., { id: 'uuid-project-1' })
   * @param {object} data - Data to update (e.g., { name: 'Updated Name' })
   * @param {string} [data.name] - The new project name.
   * @param {string} [data.description] - The new project description.
   * @returns {Promise<object>} A promise that resolves to the updated project object.
   * @throws {Error} If project update fails (e.g., due to validation or database error).
   */
  async update(project, data) {
    // TODO: Implement ProjectRepository.update method to update the project in the database.
    // This method should update the project identified by project.id with the provided data
    // and return the updated and fully hydrated project object.
    const updatedProject = await this.deps.projectRepository.update(project.id, data);
    
    return updatedProject;
  }
}


export default { ProjectService };