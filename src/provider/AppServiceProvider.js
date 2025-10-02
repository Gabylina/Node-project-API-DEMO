/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service provider for registering and booting application-wide services.
 * This class mirrors the functionality of Laravel's AppServiceProvider.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This is where you bind interfaces to implementations, register singletons,
   * or configure initial services.
   *
   * @param {object} app The application container or DI resolver.
   * @param {object} [deps={}] An object containing external dependencies (e.g., config, repositories, eventBus).
   */
  static register(app, deps = {}) {
    // TODO: Use 'app' to register services, singletons, and bindings.
    // This phase is for setting up the basic service definitions.
    // Example: app.singleton('ConfigService', () => new ConfigService(deps.configData));
    // Example: app.bind('UserRepository', () => new DatabaseUserRepository());
    // Example: app.singleton('Logger', (container) => new ConsoleLogger(container.resolve('ConfigService').get('logLevel')));
  }

  /**
   * Bootstrap any application services.
   * This is where you might register event listeners, define global macros,
   * register view composers, or perform any actions that need all services
   * to be registered first.
   *
   * @param {object} app The application container or DI resolver.
   * @param {object} [deps={}] An object containing external dependencies (e.g., config, repositories, eventBus).
   */
  static boot(app, deps = {}) {
    // TODO: Implement global hooks here.
    // This phase is for actions that rely on all 'register' calls being complete.
    // Example: Registering custom casts or macros for models/data structures.
    // if (deps.modelFactory) {
    //   deps.modelFactory.addCast('DateTime', value => new Date(value));
    // }
    // Example: Defining authorization policies if a policy manager is provided via 'deps'.
    // if (deps.policyManager && typeof deps.policyManager.define === 'function') {
    //   // const UserPolicy = (await import('../Policies/UserPolicy.js')).UserPolicy;
    //   // deps.policyManager.define('User', UserPolicy);
    // }
    // Example: Registering a global middleware or pre-processor if `app` supports it.
    // app.beforeRequest((req, res, next) => { /* ... */ next(); });
  }
}
