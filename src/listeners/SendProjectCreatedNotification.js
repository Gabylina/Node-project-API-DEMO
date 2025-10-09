// migrated from app/Listeners/SendProjectCreatedNotification.php
import { ProjectCreatedNotification } from '../notifications/ProjectCreatedNotification.js';

/**
 * Listener for the ProjectCreated event.
 * Handles sending a notification when a project is created.
 */
export class SendProjectCreatedNotification {
  /**
   * Handle the event.
   *
   * @param {object} event The event object. Expected to be similar to App\Events\ProjectCreated,
   *                       containing `event.project` and `event.project.owner`.
   * @param {object} deps Dependencies for the listener.
   * @param {object} deps.notificationService An object with a `send` method, e.g., `{ send: (recipient, notification) => Promise<void> }`.
   * @returns {Promise<void>}
   */
  async handle(event, deps = {}) {
    // TODO: Validate the 'event' object structure to ensure it matches App\Events\ProjectCreated.
    // For example: if (!event || !event.project || !event.project.owner) { throw new Error('Invalid event structure'); }

    const { notificationService } = deps;

    if (!notificationService || typeof notificationService.send !== 'function') {
      console.error('Dependency "notificationService" with a "send" method is required.');
      // Depending on the application's error handling strategy:
      throw new Error('Missing or invalid "notificationService" dependency.');
    }

    // Create an instance of the ProjectCreatedNotification.
    // This assumes ProjectCreatedNotification is a class that takes the project as a constructor argument,
    // similar to its PHP counterpart (new ProjectCreatedNotification($event->project)).
    const notification = new ProjectCreatedNotification(event.project);

    // Use the injected notification service to send the notification.
    // In Laravel, `$event->project->owner->notify(...)` typically uses a Notifiable trait
    // on the owner object. In Node.js, a dedicated service is a common pattern for this.
    await notificationService.send(event.project.owner, notification);

    // TODO: Implement robust error handling for the notification sending process,
    // e.g., using a try-catch block around `await notificationService.send(...)`.
  }
}


export default { SendProjectCreatedNotification };