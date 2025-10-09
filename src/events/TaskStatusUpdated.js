// migrated from app/Events/TaskStatusUpdated.php

/**
 * Represents a TaskStatusUpdated event.
 * This class is a plain data transfer object (DTO) that holds event data.
 */
export class TaskStatusUpdated {
  /**
   * Static property to identify the event type, useful for event listeners or dispatchers.
   * @type {string}
   */
  static event = 'TaskStatusUpdated';

  /**
   * The task object associated with the event.
   * @type {object}
   */
  task;

  /**
   * Creates an instance of TaskStatusUpdated.
   * @param {object} [payload={}] - The event data, typically including a 'task' object.
   * @param {object} [payload.task] - The task object with its properties (e.g., id, status).
   */
  constructor(payload = {}) {
    Object.assign(this, payload);
  }
}


export default { TaskStatusUpdated };