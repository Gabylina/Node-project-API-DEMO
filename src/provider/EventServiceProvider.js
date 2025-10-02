/* migrated from app/Providers/EventServiceProvider.php */

/**
 * Event bindings migrated from the PHP $listen property.
 * Each entry maps an event to an array of listener classes/identifiers.
 * @type {Array<{event: string, listeners: string[]}>}
 */
export const eventBindings = [
  { event: "App\Events\ProjectCreated", listeners: ["App\Listeners\SendProjectCreatedNotification"] },
  { event: "App\Events\TaskStatusUpdated", listeners: ["App\Listeners\SendTaskStatusNotification"] }
];

class EventServiceProvider {
  /**
   * Register any application services.
   *
   * This method is used to bind services into the application's service container.
   * For example, registering singletons, bindings, or configuration initializers.
   *
   * @param {object} app - The application container instance (e.g., a DI container).
   * @param {object} [deps={}] - Optional dependencies that might be needed for registration.
   * @returns {void}
   */
  static register(app, deps = {}) {
    // TODO: registrar servicios, singletons, bindings
    // Example: app.singleton('MyRepository', () => new MyRepository(deps.dbConnection));
    // Example: app.bind('MyService', () => new MyService(app.make('MyRepository')));
  }

  /**
   * Bootstrap any application services.
   *
   * This method is called after all other service providers have been registered.
   * It's suitable for tasks that require other services to be available,
   * such as subscribing to events, registering global middleware, or defining view composers.
   *
   * @param {object} app - The application container instance (e.g., a DI container).
   * @param {object} [deps={}] - Optional dependencies like an event bus, message queue, etc.
   * @param {object} [deps.eventBus] - An optional event bus instance with a 'bind' method.
   * @returns {void}
   */
  static boot(app, deps = {}) {
    // TODO: hooks post-registro (p.ej. suscribir eventos)

    // Register event listeners based on the migrated eventBindings.
    if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
      eventBindings.forEach(({ event, listeners }) => {
        listeners.forEach(listener => {
          // TODO: resolver el string del listener a una instancia/callable real si aplica
          // The 'listener' is currently a string representing the class name.
          // In a real application, you might need to resolve this string into
          // an actual class instance or a callable function from the 'app' container.
          // Example: deps.eventBus.bind(event, app.make(listener));
          deps.eventBus.bind(event, listener);
        });
      });
    } else {
      // TODO: Handle scenarios where eventBus is not available or doesn't have a bind method.
      //       For example, log a warning or implement a fallback mechanism.
      // console.warn('EventServiceProvider: eventBus or eventBus.bind not available, events will not be registered.');
    }
  }
}

export { EventServiceProvider };