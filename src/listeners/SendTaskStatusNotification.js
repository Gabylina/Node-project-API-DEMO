// migrated from app/Listeners/SendTaskStatusNotification.php

/**
 * Listener to send notifications when a task's status is updated.
 *
 * This class mirrors the functionality of Laravel's SendTaskStatusNotification listener,
 * adapted for a Node.js ESM environment. It handles loading related data and
 * dispatching notifications through injected services.
 */
export class SendTaskStatusNotification {
    /**
     * Handles the TaskStatusUpdated event to send notifications.
     *
     * @param {object} event - The event object, expected to have a 'task' property.
     * @param {object} event.task - The task object that has been updated.
     * @param {object} deps - An object containing necessary dependencies for the listener.
     * @param {object} deps.taskRepository - A service responsible for interacting with tasks,
     *                                      e.g., loading relations for a task object.
     * @param {object} deps.notificationService - A service responsible for sending notifications
     *                                          to users/recipients. It should have a `send` method.
     * @param {function(object): object} deps.TaskStatusChangedNotification - The constructor function
     *                                                                       for the notification object
     *                                                                       (e.g., a class representing the notification payload).
     * @throws {Error} If critical dependencies are missing or invalid.
     * @returns {Promise<void>} A promise that resolves when notifications are sent, or rejects on error.
     */
    async handle(event, deps = {}) {
        // --- Input Validation and Dependency Check ---
        if (!event || !event.task) {
            console.error('SendTaskStatusNotification: Invalid event structure. Missing event.task.');
            // Depending on application policy, you might throw an error here instead of just returning.
            return;
        }

        const { taskRepository, notificationService, TaskStatusChangedNotification } = deps;

        if (!taskRepository || typeof taskRepository.loadRelations !== 'function') {
            throw new Error('SendTaskStatusNotification: Missing or invalid `taskRepository` dependency. It must have a `loadRelations` method.');
        }
        if (!notificationService || typeof notificationService.send !== 'function') {
            throw new Error('SendTaskStatusNotification: Missing or invalid `notificationService` dependency. It must have a `send` method.');
        }
        if (typeof TaskStatusChangedNotification !== 'function') {
            throw new Error('SendTaskStatusNotification: Missing `TaskStatusChangedNotification` class dependency. It should be a constructor function.');
        }

        // --- Core Logic ---
        try {
            // Mimics Laravel's `$event->task->load('project.owner');`
            // Assumes `taskRepository.loadRelations` enriches the `event.task` object
            // or returns a new object with the specified relations (`project` and `owner` within `project`).
            const taskWithRelations = await taskRepository.loadRelations(event.task, ['project.owner']);

            // If the task has an assignee, notify them.
            // Mimics `$task->assignee->notify(new TaskStatusChangedNotification($task));`
            if (taskWithRelations.assignee) {
                const assigneeNotification = new TaskStatusChangedNotification(taskWithRelations);
                await notificationService.send(taskWithRelations.assignee, assigneeNotification);
                // TODO: Add logging for successful notification to assignee (e.g., `logger.info`).
            }

            // Notify the project owner.
            // Mimics `$task->project->owner->notify(new TaskStatusChangedNotification($task));`
            if (taskWithRelations.project && taskWithRelations.project.owner) {
                const ownerNotification = new TaskStatusChangedNotification(taskWithRelations);
                await notificationService.send(taskWithRelations.project.owner, ownerNotification);
                // TODO: Add logging for successful notification to project owner (e.g., `logger.info`).
            } else {
                console.warn(`SendTaskStatusNotification: Project owner not found for task ID: ${taskWithRelations.id || 'unknown'}. Notification skipped.`);
                // TODO: Decide if missing owner is an error that should halt execution or log with a higher severity.
            }
        } catch (error) {
            console.error(`SendTaskStatusNotification: Error handling event for task ID ${event.task.id || 'unknown'}:`, error);
            // TODO: Implement more robust error handling, e.g., re-throwing, publishing to a dead-letter queue,
            // or integrating with an error tracking service like Sentry or Bugsnag.
            throw error; // Re-throw to allow the event dispatcher or orchestrator to handle the failure.
        }
    }
}


export default { SendTaskStatusNotification };