/* migrated from app/Providers/EventServiceProvider.php */

/**
 * @typedef {Object} EventBinding
 * @property {string} event - The event name.
 * @property {string[]} listeners - An array of listener names.
 */

/** @type {EventBinding[]} */
export const eventBindings = [
  { event: "App\Events\ProjectCreated", listeners: ["App\Listeners\SendProjectCreatedNotification"] },
  { event: "App\Events\TaskStatusUpdated", listeners: ["App\Listeners\SendTaskStatusNotification"] }
];

export class EventServiceProvider {
  /**
   * Register any application services.
   *
   * @param {Object} app - The application container instance.
   * @param {Object} [deps={}] - An object containing dependencies.
   */
  static register(app, deps = {}) {
    // TODO: registrar servicios, singletons, bindings específicos que este ServiceProvider necesite.
  }

  /**
   * Bootstrap any application services.
   *
   * @param {Object} app - The application container instance.
   * @param {Object} [deps={}] - An object containing dependencies (e.g., eventBus).
   */
  static boot(app, deps = {}) {
    // TODO: if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
    //   eventBindings.forEach(({ event, listeners }) => {
    //     listeners.forEach(listener => {
    //       // TODO: resolver el string del listener a una instancia/callable real si aplica (p.ej. usando un contenedor DI: app.make(listener) o similar)
    //       deps.eventBus.bind(event, listener);
    //     });
    //   });
    // }
  }
}
