// migrated from app/Listeners/SendProjectCreatedNotification.php

/**
 * Listener for the ProjectCreated event.
 * Handles sending a notification to the project owner.
 */
export class SendProjectCreatedNotification {
  /**
   * Handle the event.
   *
   * @param {object} event - The ProjectCreated event object.
   *   Expected structure: { project: { owner: { /* ... */ } } }
   * @param {object} [deps={}] - Dependencies object.
   *   Expected:
   *     - NotificationService: An object with an `async send(recipient, notification)` method.
   *     - ProjectCreatedNotificationClass: The constructor function for the ProjectCreatedNotification (e.g., `class ProjectCreatedNotification { constructor(project) { ... } }`).
   * @returns {Promise<void>}
   * @throws {Error} If required dependencies are missing or event structure is invalid.
   */
  async handle(event, deps = {}) {
    const { NotificationService, ProjectCreatedNotificationClass } = deps;

    // TODO: Ensure NotificationService and ProjectCreatedNotificationClass are properly injected and configured.
    // In a real application, these dependencies would typically be provided through a
    // dependency injection container or passed explicitly during listener registration.

    if (!NotificationService || typeof NotificationService.send !== 'function') {
      throw new Error('Dependency missing: NotificationService with an `async send(recipient, notification)` method is required.');
    }
    if (!ProjectCreatedNotificationClass) {
      throw new Error('Dependency missing: ProjectCreatedNotificationClass constructor is required.');
    }
    if (!event || !event.project || !event.project.owner) {
        throw new Error('Invalid event structure: `event.project.owner` is required to send notification.');
    }

    // Instantiate the notification using the provided class constructor
    const notificationInstance = new ProjectCreatedNotificationClass(event.project);

    // Send the notification using the provided NotificationService
    await NotificationService.send(event.project.owner, notificationInstance);

    // TODO: Add logging for successful notification dispatch if needed (e.g., `console.log('Notification sent.');`).
  }
}


export default { SendProjectCreatedNotification };