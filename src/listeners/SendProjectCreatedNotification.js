// migrated from app/Listeners/SendProjectCreatedNotification.php

export class SendProjectCreatedNotification {
  /**
   * Handle the event.
   *
   * @param {object} event The event object, expected to have `project.owner` and `project` properties.
   * @param {object} deps Dependencies, expected to include `ProjectCreatedNotification`.
   */
  async handle(event, deps = {}) {
    const { ProjectCreatedNotification } = deps;

    if (!ProjectCreatedNotification) {
      console.error('Dependency "ProjectCreatedNotification" not provided to SendProjectCreatedNotification.');
      // TODO: Implement appropriate error handling or default behavior if notification class is missing.
      return;
    }

    // Ensure event structure exists before proceeding
    if (!event || !event.project || !event.project.owner) {
      console.warn('Event missing "project" or "project.owner" property. Cannot send notification.');
      // TODO: Decide if this should throw an error or just log and return.
      return;
    }

    // Ensure the owner object has a notify method, similar to Laravel's Notifiable trait.
    if (typeof event.project.owner.notify !== 'function') {
      console.warn('Owner object does not have a "notify" method. Notification will not be sent.');
      // TODO: Implement or inject a default notification sender if owner doesn't have one.
      return;
    }

    // Instantiate the notification class, passing the project to its constructor.
    // This assumes ProjectCreatedNotification's constructor accepts the project object.
    const notification = new ProjectCreatedNotification(event.project);

    // Call the notify method on the owner, which is expected to handle the actual notification sending.
    // This operation is typically asynchronous (e.g., sending email via API, push notification).
    await event.project.owner.notify(notification);
  }
}


export default { SendProjectCreatedNotification };