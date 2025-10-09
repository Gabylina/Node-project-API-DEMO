// migrated from app/Listeners/SendTaskStatusNotification.php

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} status
 * @property {string} [name]
 * @property {string | null} assigneeId
 * @property {object | null} assignee - The assignee user object, if loaded.
 * @property {object | null} project - The project object, if loaded.
 * @property {string} [project.id]
 * @property {string} [project.name]
 * @property {object | null} [project.owner] - The project owner user object, if loaded.
 */

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} [email]
 * @property {string} [name]
 * // ... other user properties relevant for notification
 */

/**
 * @typedef {object} TaskRepository
 * @property {(taskId: string, relations: string[]) => Promise<Task | null>} findWithRelations - Method to find a task by ID and eager load specified relations.
 * // Add other methods as needed, e.g., findAssignee
 */

/**
 * @typedef {object} NotificationService
 * @property {(recipient: User, notificationPayload: object) => Promise<void>} send - Method to dispatch a notification to a recipient.
 */

/**
 * @typedef {object} TaskStatusChangedNotificationBuilder
 * @property {(task: Task) => object} build - Method to construct the notification payload for a task.
 */

export class SendTaskStatusNotification {
  /**
   * Handle the TaskStatusUpdated event to send notifications.
   *
   * @param {object} event - The event object, expected to have `event.task`.
   * @param {Task} event.task - The task object from the event.
   * @param {object} [deps={}] - Dependencies injected into the listener.
   * @param {TaskRepository} [deps.taskRepository] - Repository for task-related database operations.
   * @param {NotificationService} [deps.notificationService] - Service for sending notifications.
   * @param {TaskStatusChangedNotificationBuilder} [deps.TaskStatusChangedNotificationBuilder] - Builder for creating notification payloads.
   */
  async handle(event, deps = {}) {
    const {
      taskRepository,
      notificationService,
      TaskStatusChangedNotificationBuilder
    } = deps;

    if (!event || !event.task) {
      console.error("Missing event or event.task in SendTaskStatusNotification.handle");
      return;
    }

    let task = event.task;

    // TODO: Replicate Laravel's `$task->load('project.owner')` functionality.
    // This involves fetching the task from your Node.js ORM/database with its related 'project', 'project.owner', and 'assignee'.
    // If `event.task` is already a fully loaded ORM model instance with these relations, 
    // this step might be partially or fully redundant, depending on your Node.js ORM setup.
    if (taskRepository && typeof taskRepository.findWithRelations === 'function' && task.id) {
      try {
        const loadedTask = await taskRepository.findWithRelations(task.id, ['project.owner', 'assignee']);
        if (loadedTask) {
          task = loadedTask;
        } else {
          console.warn(`Task with ID ${task.id} not found in repository. Proceeding with event.task.`);
        }
      } catch (error) {
        console.error(`Error loading task relations for ID ${task.id}:`, error);
        // Decide whether to re-throw or continue with potentially incomplete task data
      }
    } else if (!task.project?.owner || !task.assignee) {
      // If no taskRepository is provided or task.id is missing, and relations are not already present,
      // subsequent notification logic might fail. This is a critical TODO.
      console.warn("Task relations (project.owner, assignee) might not be fully loaded. Ensure `taskRepository` is provided or `event.task` is pre-loaded.");
    }

    // TODO: Define the `TaskStatusChangedNotificationBuilder` or integrate directly into a notification service.
    // This function should construct the specific payload (e.g., email subject, body, data) for the notification.
    const getNotificationPayload = (currentTask) => {
      if (TaskStatusChangedNotificationBuilder && typeof TaskStatusChangedNotificationBuilder.build === 'function') {
        return TaskStatusChangedNotificationBuilder.build(currentTask);
      }
      // Default payload if no builder is provided
      return {
        type: 'TaskStatusChanged',
        data: {
          taskId: currentTask.id,
          status: currentTask.status,
          taskName: currentTask.name, // Assuming task has a 'name' property
          projectName: currentTask.project?.name,
          // Add other relevant task details as needed for the notification
        },
        subject: `Task "${currentTask.name || currentTask.id}" status updated to "${currentTask.status}"`,
        // ... more specific notification details
      };
    };

    // Notify assignee
    if (task.assignee) {
      if (notificationService && typeof notificationService.send === 'function') {
        try {
          const payload = getNotificationPayload(task);
          await notificationService.send(task.assignee, payload);
          console.log(`Notification sent to assignee ${task.assignee.id} for task ${task.id}`);
        } catch (error) {
          console.error(`Failed to send notification to assignee ${task.assignee.id} for task ${task.id}:`, error);
        }
      } else {
        console.warn("`notificationService` or `send` method not provided for assignee notification in dependencies.");
      }
    }

    // Notify project owner
    if (task.project && task.project.owner) {
      if (notificationService && typeof notificationService.send === 'function') {
        try {
          const payload = getNotificationPayload(task);
          await notificationService.send(task.project.owner, payload);
          console.log(`Notification sent to project owner ${task.project.owner.id} for task ${task.id}`);
        } catch (error) {
          console.error(`Failed to send notification to project owner ${task.project.owner.id} for task ${task.id}:`, error);
        }
      } else {
        console.warn("`notificationService` or `send` method not provided for project owner notification in dependencies.");
      }
    } else {
      console.warn(`Project or project owner not found for task ${task.id}. Cannot send notification to owner.`);
    }
  }
}


export default { SendTaskStatusNotification };