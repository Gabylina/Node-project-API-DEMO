// migrated from app/Models/Project.php

export class Project {
  /**
   * @param {string | number | null} id - The unique identifier of the project.
   * @param {string} name - The name of the project.
   * @param {string | null} description - The description of the project.
   * @param {string | number} userId - The ID of the user who owns this project.
   */
  constructor(id, name, description, userId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
  }

  /**
   * Creates a Project instance from a plain JavaScript object (e.g., from a database row or API payload).
   * @param {object} obj - The plain object containing project data.
   * @param {string | number | null} obj.id - The project ID.
   * @param {string} obj.name - The project name.
   * @param {string | null} obj.description - The project description.
   * @param {string | number} obj.user_id - The ID of the owner user.
   * @returns {Project}
   */
  static from(obj) {
    if (!obj) {
      throw new Error('Cannot create Project from null or undefined object.');
    }
    return new Project(
      obj.id ?? null,
      obj.name,
      obj.description ?? null,
      obj.user_id
    );
  }

  /**
   * Converts the Project instance to a plain JavaScript object, suitable for JSON serialization.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
  }

  // TODO: Relationships (owner, tasks)
  // In a clean architecture, relationships are typically resolved by a dedicated "Repository" or "Service" layer.
  // The `Project` entity itself should not contain direct logic for fetching related entities.
  // Example of how you might fetch an owner or tasks in a service:
  // 
  // class ProjectService {
  //   constructor(projectRepository, userRepository, taskRepository) {
  //     this.projectRepository = projectRepository;
  //     this.userRepository = userRepository;
  //     this.taskRepository = taskRepository;
  //   }
  //
  //   async getProjectWithOwner(projectId) {
  //     const project = await this.projectRepository.findById(projectId);
  //     if (!project) return null;
  //     const owner = await this.userRepository.findById(project.userId);
  //     // You might return an object like { project, owner } or a combined DTO
  //     return { ...project.toJSON(), owner: owner ? owner.toJSON() : null };
  //   }
  //
  //   async getProjectWithTasks(projectId) {
  //     const project = await this.projectRepository.findById(projectId);
  //     if (!project) return null;
  //     const tasks = await this.taskRepository.findByProjectId(project.id);
  //     return { ...project.toJSON(), tasks: tasks.map(t => t.toJSON()) };
  //   }
  // }

  // TODO: Handle `$fillable` properties
  // The `protected $fillable` array in Laravel dictates which attributes can be mass-assigned.
  // In this clean entity, the constructor explicitly defines the core properties.
  // Enforcement of what fields can be created/updated should be handled by the `ProjectRepository`
  // (e.g., in its `create` or `update` methods) or by validation rules in a service layer.

  // TODO: Handle `$casts` properties
  // Laravel's `$casts` convert attributes to specific types (e.g., datetime, boolean, JSON).
  // In Node.js, this conversion should happen explicitly in the `static from(obj)` method
  // if the incoming `obj` contains raw database types (e.g., converting a date string to a `Date` object).
  // Example: if `created_at` was cast to `datetime`:
  //   this.createdAt = obj.created_at ? new Date(obj.created_at) : null;
  //   And in `toJSON()`: `created_at: this.createdAt ? this.createdAt.toISOString() : null`

  // TODO: Handle `$hidden` properties
  // Laravel's `$hidden` properties are not included when the model is converted to an array or JSON.
  // In this class, you would explicitly omit properties from the `toJSON()` method if they are meant to be hidden.
  // Currently, `toJSON()` includes all core properties. Adjust as needed.

  // TODO: Eloquent Factories (HasFactory trait)
  // Factories are a Laravel-specific way to generate dummy model instances for testing/seeding.
  // For Node.js, you would typically implement separate "test data builders" or "fixture generators"
  // that create plain objects or instances of your `Project` class, independent of the domain entity itself.
}


export default { Project };