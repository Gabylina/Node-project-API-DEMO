// migrated from app/Listeners/SendTaskStatusNotification.php

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} email
 * // ... other user properties (e.g., name, preferred_language)
 */

/**
 * @typedef {object} Project
 * @property {string} id
 * @property {User} owner
 * @property {string} name
 * // ... other project properties
 */

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} status
 * @property {string} title
 * @property {User|null} assignee
 * @property {Project} project
 * // ... other task properties
 */

/**
 * @typedef {object} TaskStatusUpdatedEvent
 * @property {Task} task - The task whose status was updated. It should ideally include `project` and `project.owner` already loaded.
 * // ... other event properties
 */

/**
 * @typedef {object} NotificationPayload
 * @property {string} type - A string identifying the type of notification (e.g., 'task_status_changed').
 * @property {object} data - The actual data for the notification, containing relevant task details.
 * @property {string} data.task_id
 * @property {string} data.task_status
 * @property {string} data.task_title
 * @property {string} data.project_id
 * @property {string} data.project_name
 * // ... other relevant data points for the notification recipient
 */

/**
 * @typedef {object} Dependencies
 * @property {object} db - Database access object (e.g., ORM instance like Prisma client, Sequelize models).
 * @property {object} notifier - Notification service for sending messages across different channels.
 * @property {function(User|Project['owner'], NotificationPayload): Promise<void>} notifier.sendNotification - Method to send a notification to a recipient.
 */

export class SendTaskStatusNotification {
  /**
   * Handle the TaskStatusUpdated event.
   * This listener sends notifications to the task's assignee and the project's owner
   * when a task's status is updated.
   * @param {TaskStatusUpdatedEvent} event - The event object containing task details.
   * @param {Dependencies} deps - Injected dependencies (e.g., database, notification service).
   * @returns {Promise<void>}
   */
  async handle(event, deps = {}) {
    // TODO: Implement robust input validation for `event` object to ensure expected structure and data integrity.

    const { notifier } = deps;

    // Ensure the notifier dependency is provided and has the expected method.
    if (!notifier || typeof notifier.sendNotification !== 'function') {
      console.error('Missing or invalid `notifier` dependency. Cannot send notifications.');
      throw new Error('Notification service is not properly configured.');
    }

    /** @type {Task} */
    const task = event.task;

    // PHP's `$event->task->load('project.owner')` ensures relationships are loaded.
    // In Node.js, `event.task` should ideally arrive with `project` and `project.owner` already populated
    // by the event emitter to avoid extra database calls here.
    // If not, you would need to fetch them from your database here using `deps.db`.
    // Example if fetching is required: (uncomment and adjust to your specific ORM/DB client)
    /*
    if (!task.project || !task.project.owner) {
      console.log(`Loading full task for ID: ${task.id} due to missing relations.`);
      // Assuming `deps.db` exposes an ORM client (e.g., Prisma client, Sequelize models)
      const fullTask = await deps.db.task.findUnique({
        where: { id: task.id },
        include: {
          project: {
            include: { owner: true }
          },
          assignee: true // Also load assignee if it might be missing from event
        }
      });
      if (!fullTask) {
        console.error(`Task with ID ${task.id} not found.`);
        return; // Or throw an error if the task must exist
      }
      // Update the existing task object with the loaded relations
      Object.assign(task, fullTask);
    }
    */

    // Create a notification payload. This replaces `new TaskStatusChangedNotification($task)`
    // in Laravel, which typically constructs channel-specific messages. Here, we create
    // a generic data structure that the `notifier` service can then interpret and format.
    /** @type {NotificationPayload} */
    const notificationPayload = {
      type: 'task_status_changed',
      data: {
        task_id: task.id,
        task_status: task.status,
        task_title: task.title,
        project_id: task.project?.id,
        project_name: task.project?.name,
        // Add more context here as needed for the notification content (e.g., URL to task).
      },
    };

    // Notify the assignee if one exists
    if (task.assignee) {
      console.log(`Sending task status update notification to assignee: ${task.assignee.email} for task ID: ${task.id}`);
      await notifier.sendNotification(task.assignee, notificationPayload);
    } else {
      console.log(`Task ID: ${task.id} has no assignee. Skipping assignee notification.`);
    }

    // Notify the project owner
    // Use optional chaining (`?.`) for safer access to nested properties.
    if (task.project?.owner) {
      console.log(`Sending task status update notification to project owner: ${task.project.owner.email} for task ID: ${task.id}`);
      await notifier.sendNotification(task.project.owner, notificationPayload);
    } else {
      console.error(`Task ID: ${task.id} is missing project or project owner. Cannot notify project owner.`);
      // Depending on the application's strictness, you might throw an error here.
    }
  }
}


export default { SendTaskStatusNotification };