// migrated from app/Listeners/SendProjectCreatedNotification.php

export class SendProjectCreatedNotification {
  /**
   * Handle the event to send a project creation notification.
   * @param {object} event - The event object, expected to have `event.project` which contains `project.owner`.
   * @param {object} deps - Dependencies object, expected to contain `notificationService`.
   */
  async handle(event, deps = {}) {
    /* TODO:
     * 1. Access the `project` and its `owner` from the `event` object.
     *    Example: `const project = event.project;`
     *    Example: `const owner = project.owner;`
     *
     * 2. Construct the notification payload (an object representing the `ProjectCreatedNotification`).
     *    In PHP, `new ProjectCreatedNotification($event->project)` creates an instance.
     *    In Node.js, this would typically be a plain JavaScript object or DTO describing the notification,
     *    e.g., `{ type: 'ProjectCreated', data: event.project }`.
     *
     * 3. Utilize a provided dependency (e.g., `deps.notificationService`) to dispatch the notification to the owner.
     *    The Laravel `->notify()` method dispatches the notification via its internal service.
     *    In Node.js, you would map this to your chosen notification system (e.g., an email service, a push notification service,
     *    or an internal event dispatcher for in-app notifications).
     *    Example: `await deps.notificationService.send(owner, { type: 'ProjectCreated', data: project });`
     *
     * Ensure that `deps` is properly populated with the necessary services when instantiating or calling this listener.
     */
    // Example placeholder implementation:
    const { notificationService } = deps;

    if (!notificationService) {
      console.error('SendProjectCreatedNotification: Missing notificationService dependency.');
      // Depending on your error handling strategy, you might throw an error or log more details.
      return;
    }

    const project = event.project;
    const owner = project.owner; // Assuming owner is directly accessible on the project object

    const notificationPayload = {
      type: 'project.created', // A unique identifier for this notification type
      recipient: { id: owner.id, type: 'user' }, // Identifying the recipient
      data: {
        projectId: project.id,
        projectName: project.name,
        // Add other relevant project details needed for the notification message
        // Example: projectUrl: `/projects/${project.id}`
      },
      // Optional: sender, timestamp, priority, etc.
    };

    try {
      // Assuming `notificationService.send` method handles the actual dispatch
      await notificationService.send(owner, notificationPayload);
      console.log(`[SendProjectCreatedNotification] Sent project created notification for project ${project.id} to owner ${owner.id}.`);
    } catch (error) {
      console.error(`[SendProjectCreatedNotification] Failed to send notification for project ${project.id} to owner ${owner.id}:`, error);
      // Implement robust error handling, e.g., retry mechanisms, logging to a dedicated error tracking system.
    }
  }
}


export default { SendProjectCreatedNotification };