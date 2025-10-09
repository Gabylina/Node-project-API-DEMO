/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service Provider for registering application-level services and booting global configurations.
 *
 * This class mirrors the functionality of Laravel's AppServiceProvider,
 * adapted for a Node.js environment using dependency injection.
 *
 * @class AppServiceProvider
 */
export class AppServiceProvider {

  /**
   * Register any application services.
   *
   * In a Node.js context, this method is used to define service bindings,
   * singletons, configurations, or prepare instances for dependency injection.
   *
   * @static
   * @param {object} app - The application container/DI context. This object should provide methods like `bind`, `singleton`, `register`, etc.
   * @param {object} [deps={}] - An object containing external dependencies (e.g., config, logger, database connection) that might be needed during registration.
   */
  static register(app, deps = {}) {
    // TODO: Register application-level services, singletons, or configurations here.
    // Example: app.bind('UserRepository', () => new UserRepository(deps.dbConnection));
    // Example: app.singleton('ConfigService', () => new ConfigService(deps.env));
    // Example: app.register('SomeService', SomeService); // Registering a class to be resolved later.

    // console.log('AppServiceProvider: register method called.');
  }

  /**
   * Bootstrap any application services.
   *
   * This method is called after all service providers have been registered.
   * It's suitable for operations that depend on other services already being registered,
   * such as subscribing to events, registering global middleware, or defining custom functionalities.
   *
   * @static
   * @param {object} app - The application container/DI context, now fully populated with registered services.
   * @param {object} [deps={}] - An object containing external dependencies (e.g., eventBus, config, logger) that might be needed for bootstrapping.
   */
  static boot(app, deps = {}) {
    // TODO: Perform global bootstrapping tasks here.
    // Example: If `deps.eventBus` is available, subscribe global event listeners.
    // Example: Define custom data type casts or "macros" if a similar concept exists in the Node.js framework/library being used.
    // Example: Register global authorization policies or middlewares.

    // console.log('AppServiceProvider: boot method called.');
  }
}
