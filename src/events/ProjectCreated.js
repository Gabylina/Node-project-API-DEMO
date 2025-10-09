// migrated from app/Events/ProjectCreated.php

export class ProjectCreated {
  static event = 'ProjectCreated';

  /**
   * Create a new event instance.
   *
   * @param {object} payload - The event payload, e.g., { project: { id: 1, name: 'New Project' } }
   */
  constructor(payload = {}) {
    Object.assign(this, payload);
  }
}

export default { ProjectCreated };