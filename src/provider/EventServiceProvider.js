/* migrated from app/Providers/EventServiceProvider.php */

/**
 * @typedef {Object} NodeAppContainer
 * @property {function(string, any): void} bind
 * @property {function(string): any} make
 * @property {function(string, any): void} singleton
 * // Add other common container methods as needed
 */

/**
 * @typedef {Object} NodeEventBus
 * @property {function(string, function|string): void} bind - Binds a listener to an event.
 * @property {function(string, any): void} emit - Emits an event.
 * // Add other common event bus methods as needed
 */

/**
 * @typedef {Object} EventProviderDependencies
 * @property {NodeEventBus} [eventBus] - An event bus instance.
 * // Add other dependencies relevant to event providers (e.g., logger)
 */

export const eventBindings = [
  { event: "ProjectCreated", listeners: ["SendProjectCreatedNotification"] },
  { event: "TaskStatusUpdated", listeners: ["SendTaskStatusNotification"] }
];

/**
 * Node.js equivalent of Laravel's EventServiceProvider.
 * Manages event-listener mappings and can register them with an event bus.
 */
class EventServiceProvider {
  /**
   * Register any application services.
   * This is where you would typically bind services, singletons, or configurations
   * that need to be available immediately upon application startup.
   *
   * @param {NodeAppContainer} app - The application container instance.
   * @param {EventProviderDependencies} [deps={}] - Additional dependencies.
   * @returns {void}
   */
  static register(app, deps = {}) {
    // TODO: Register any necessary services, singletons, or configurations here.
    // In Laravel, EventServiceProvider often doesn't have much in 'register'
    // unless it's for advanced event features like event discovery. For Node.js,
    // this might involve binding an EventBus instance if not provided externally.
  }

  /**
   * Bootstrap any application services.
   * This is where you would typically register event listeners,
   * define view composers, or other post-registration hooks.
   *
   * @param {NodeAppContainer} app - The application container instance.
   * @param {EventProviderDependencies} [deps={}] - Additional dependencies.
   * @returns {void}
   */
  static boot(app, deps = {}) {
    // TODO: if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
    //   eventBindings.forEach(({ event, listeners }) => {
    //     listeners.forEach(listener => {
    //       // TODO: resolver el string del listener a una instancia/callable real si aplica.
    //       //       This might involve using the 'app' container to resolve the listener string
    //       //       into an actual callable or class instance. Example: deps.eventBus.bind(event, app.make(listener));
    //       //       If the listener is just a string for an adapter to resolve later, it can be passed directly.
    //       deps.eventBus.bind(event, listener);
    //     });
    //   });
    // }
    // If no eventBus is provided, the bindings are still exported via `eventBindings`
    // for external systems to consume or manual registration.
  }
}

export { EventServiceProvider };
