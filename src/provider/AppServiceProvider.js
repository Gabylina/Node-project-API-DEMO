/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service Provider equivalent for Node.js applications.
 * This class handles the registration and booting of application-level services.
 */
export class AppServiceProvider {
  /**
   * Register any application services with the application container.
   * This method is primarily used for binding services, singletons, or
   * configuring initial application settings within a DI container.
   *
   * @param {object} app The application's dependency injection container or core application instance.
   * @param {object} [deps={}] Additional external dependencies (e.g., config, logger) for registration.
   */
  static register(app, deps = {}) {
    // TODO: Register services, singletons, and configure initial application settings here.
    // Example of binding a service:
    // app.bind('UserService', () => new UserService(deps.repository));

    // Example of registering a singleton:
    // app.singleton('ConfigService', () => new ConfigService(deps.config));

    // Example of initial configuration:
    // if (deps.config?.get('app.debug')) {
    //   // enable debug features
    // }
  }

  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered.
   * It's suitable for tasks that depend on registered services, such as
   * subscribing to events, defining global hooks, or registering custom extensions.
   *
   * @param {object} app The application's dependency injection container or core application instance.
   * @param {object} [deps={}] Additional external dependencies (e.g., eventBus, logger) for booting.
   */
  static boot(app, deps = {}) {
    // TODO: Perform post-registration tasks, global hooks, or advanced configurations here.
    // Examples:
    // - Registering global data transformers or 'casts' for a data layer.
    // - Defining 'macros' for utility classes (e.g., adding a custom method to an existing class).
    // - Registering authorization policies if a policy management system is in place.
    // - Subscribing to application lifecycle events if an event bus is available.

    // Example for a hypothetical eventBus:
    // if (deps.eventBus && typeof deps.eventBus.on === 'function') {
    //   deps.eventBus.on('application.initialized', () => {
    //     console.log('Application has finished booting.');
    //   });
    // }
  }
}