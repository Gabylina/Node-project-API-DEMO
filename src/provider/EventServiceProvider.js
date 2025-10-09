/* migrated from app/Providers/EventServiceProvider.php */

export const eventBindings = [
  { event: "ProjectCreated", listeners: ["SendProjectCreatedNotification"] },
  { event: "TaskStatusUpdated", listeners: ["SendTaskStatusNotification"] },
];

export class EventServiceProvider {
  /**
   * Register any application services.
   *
   * @param {object} app The application container instance.
   * @param {object} [deps={}] Additional dependencies.
   */
  static register(app, deps = {}) {
    /* TODO: registrar servicios, singletons, bindings */
  }

  /**
   * Bootstrap any application services.
   *
   * @param {object} app The application container instance.
   * @param {object} [deps={}] Additional dependencies (e.g., { eventBus: myEventBusInstance }).
   */
  static boot(app, deps = {}) {
    // TODO: if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
    //   eventBindings.forEach(({ event, listeners }) => {
    //     listeners.forEach(listener => {
    //       // TODO: resolver el string del listener a una instancia/callable real si aplica
    //       deps.eventBus.bind(event, listener);
    //     });
    //   });
    // }
  }
}
