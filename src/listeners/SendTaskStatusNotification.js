// migrated from app/Listeners/SendTaskStatusNotification.php

export class SendTaskStatusNotification {
  /**
   * Handles the TaskStatusUpdated event to send notifications.
   *
   * @param {object} event - The event object, expected to contain `task` (at least `task.id`).
   * @param {object} deps - Dependencies for the listener (e.g., taskRepository, notificationService).
   * @param {object} [deps.taskRepository] - A service/repository to load task data and relationships.
   * @param {object} [deps.notificationService] - A service to send notifications.
   */
  async handle(event, deps = {}) {
    // PHP: $task = $event->task->load('project.owner');
    // In Node.js, `event.task` would typically be a plain object.
    // We need to explicitly load relationships using a data access layer.
    let task;
    if (deps.taskRepository && typeof deps.taskRepository.findByIdWithRelations === 'function') {
      // TODO: Implement `findByIdWithRelations` in `deps.taskRepository` to load 'assignee' and 'project.owner'.
      // Example: const task = await deps.taskRepository.findByIdWithRelations(event.task.id, { relations: ['assignee', 'project.owner'] });
      try {
        task = await deps.taskRepository.findByIdWithRelations(event.task.id, {
          relations: ['assignee', 'project.owner'] // Specify relations to load
        });
      } catch (error) {
        console.error(`[SendTaskStatusNotification] Error loading task relations for ID ${event.task.id}:`, error);
        return; // Cannot proceed without the task
      }
    } else {
      // Fallback or error if taskRepository is not provided or properly configured.
      console.warn("[SendTaskStatusNotification] `taskRepository` or `findByIdWithRelations` missing from dependencies. Proceeding with event.task, which might be incomplete.");
      task = event.task; // Use the task from the event, but relationships might be missing.
    }

    if (!task) {
      console.error(`[SendTaskStatusNotification] Task with ID ${event.task.id} not found after loading relations.`);
      return; // Cannot proceed without a valid task.
    }

    // PHP: if ($task->assignee) {
    if (task.assignee) {
      // PHP: $task->assignee->notify(new TaskStatusChangedNotification($task));
      // In Node.js, this requires a notification service.
      if (deps.notificationService && typeof deps.notificationService.sendTaskStatusChanged === 'function') {
        // TODO: Implement `sendTaskStatusChanged` in `deps.notificationService`.
        // Example: await deps.notificationService.sendTaskStatusChanged(task.assignee, task);
        await deps.notificationService.sendTaskStatusChanged(task.assignee, task);
        console.log(`[SendTaskStatusNotification] Notification sent to assignee ${task.assignee.id} for task ${task.id}.`);
      } else {
        console.warn("[SendTaskStatusNotification] `notificationService` or `sendTaskStatusChanged` missing from dependencies. Assignee notification skipped.");
      }
    }

    // PHP: $task->project->owner->notify(new TaskStatusChangedNotification($task));
    if (task.project && task.project.owner) {
      if (deps.notificationService && typeof deps.notificationService.sendTaskStatusChanged === 'function') {
        // TODO: Implement `sendTaskStatusChanged` in `deps.notificationService`.
        // Example: await deps.notificationService.sendTaskStatusChanged(task.project.owner, task);
        await deps.notificationService.sendTaskStatusChanged(task.project.owner, task);
        console.log(`[SendTaskStatusNotification] Notification sent to project owner ${task.project.owner.id} for task ${task.id}.`);
      } else {
        console.warn("[SendTaskStatusNotification] `notificationService` or `sendTaskStatusChanged` missing from dependencies. Project owner notification skipped.");
      }
    } else {
      console.warn(`[SendTaskStatusNotification] Project or project owner not found for task ${task.id}. Notification to owner skipped.`);
    }
  }
}


export default { SendTaskStatusNotification };