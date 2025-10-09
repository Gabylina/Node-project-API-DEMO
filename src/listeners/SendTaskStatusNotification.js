// migrated from app/Listeners/SendTaskStatusNotification.php

export class SendTaskStatusNotification {
  /**
   * Handle the event to send task status notifications.
   *
   * @param {object} event The event object. Expected to have `event.task` (e.g., `{ id: 123 }` or a partial task object).
   * @param {object} deps Dependencies object.
   * @param {object} deps.taskRepository A service or repository to interact with task data.
   *   Expected methods: `loadRelations(task, relationsArray)` that takes a task object and loads specified relations onto it.
   * @param {object} deps.notificationService A service to send notifications.
   *   Expected methods: `send(recipient, notificationType, data)` where `recipient` is an object (e.g., with `id`, `email`), `notificationType` is a string identifier, and `data` is the payload.
   */
  async handle(event, deps = {}) {
    // --- START TODO: Implement robust dependency validation and error handling --- 
    // Example: Throw an error if essential dependencies are missing.
    if (!deps.taskRepository || typeof deps.taskRepository.loadRelations !== 'function') {
      console.warn('Missing or invalid `deps.taskRepository.loadRelations` dependency. Make sure it can load related models.');
      // throw new Error('Task repository is not correctly provided.');
    }
    if (!deps.notificationService || typeof deps.notificationService.send !== 'function') {
      console.warn('Missing or invalid `deps.notificationService.send` dependency. Make sure it can dispatch notifications.');
      // throw new Error('Notification service is not correctly provided.');
    }
    // --- END TODO --- 

    // In Laravel, `$event->task` is typically an Eloquent model instance.
    // The `load()` method eagerly loads relations onto that existing model.
    // In Node.js, `deps.taskRepository.loadRelations` would perform a similar function,
    // enriching the `event.task` object with its 'project' and 'owner' relations.
    // Ensure `event.task` contains necessary identifiers (e.g., `id`) for your `taskRepository` to work.
    const task = await deps.taskRepository.loadRelations(event.task, ['project.owner']);

    // Check if an assignee exists and send notification to them
    if (task.assignee) {
      // In Laravel: `$task->assignee->notify(new TaskStatusChangedNotification($task));`
      // In Node.js, `deps.notificationService.send` would handle dispatching based on recipient type.
      // `TaskStatusChangedNotification` is treated as a string identifier for the notification type.
      // TODO: Ensure `task.assignee` object has the necessary properties (e.g., `id`, `email`) for your notification service to identify the recipient.
      await deps.notificationService.send(
        task.assignee,
        'TaskStatusChangedNotification', // Identifier for the notification type
        { task } // The data payload for the notification
      );
    }

    // Send notification to the project owner
    // In Laravel: `$task->project->owner->notify(new TaskStatusChangedNotification($task));`
    // TODO: Ensure `task.project.owner` object has the necessary properties for your notification service.
    await deps.notificationService.send(
      task.project.owner,
      'TaskStatusChangedNotification', // Identifier for the notification type
      { task } // The data payload for the notification
    );
  }
}


export default { SendTaskStatusNotification };