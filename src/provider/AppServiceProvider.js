/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service provider for registering and booting application services.
 * This class mirrors the functionality of Laravel's AppServiceProvider,
 * adapted for a Node.js (ESM) environment.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This method is intended for binding services into the application's
   * dependency injection container or performing initial configurations.
   *
   * @param {object} app The application container or equivalent DI system.
   * @param {object} [deps={}] Additional dependencies that might be needed (e.g., config, specific modules).
   */
  static register(app, deps = {}) {
    // TODO: Registrar servicios, singletons, y bindings en el contenedor 'app'.
    //       Ejemplo:
    //       if (app && typeof app.singleton === 'function') {
    //         app.singleton('MyService', () => new MyService(deps.config));
    //         app.bind('MyRepository', () => new MyRepository(app.make('DBConnection')));
    //       }

    // TODO: Realizar configuración inicial que no depende de otros servicios ya bootstrapped.
    //       Ejemplo: Inicializar un sistema de logging, cargar configuraciones esenciales.
    //       if (deps.logger && typeof deps.logger.info === 'function') {
    //         deps.logger.info('AppServiceProvider: services registration started.');
    //       }
  }

  /**
   * Bootstrap any application services.
   * This method is intended for hooking into the application's lifecycle
   * after all services have been registered. This is where global configurations
   * and event subscriptions typically occur.
   *
   * @param {object} app The application container or equivalent DI system.
   * @param {object} [deps={}] Additional dependencies that might be needed (e.g., eventBus, config).
   */
  static boot(app, deps = {}) {
    // TODO: Implementar hooks globales post-registro.
    //       Ejemplo: Registrar políticas (authorization policies), macros, casts personalizados,
    //       u otros observadores globales si la aplicación los utiliza.

    // TODO: Si la aplicación tiene un sistema de políticas (similar a Laravel's Policies):
    //       if (deps.authorizationService && typeof deps.authorizationService.registerPolicy === 'function') {
    //         deps.authorizationService.registerPolicy('User', UserPolicy);
    //       }

    // TODO: Si existen "macros" para extender clases existentes (similar a Laravel's Macros):
    //       MyExtendedClass.macro('customMethod', function() { /* ... */ });

    // TODO: Si hay un sistema de "casts" para modelos de datos (similar a Laravel's Eloquent casts):
    //       DataModel.registerCast('json', JsonCastHandler);

    // TODO: Cualquier otra inicialización que dependa de que todos los servicios estén registrados.
    //       Ejemplo: Cargar rutas de API dinámicamente o inicializar conexiones secundarias.
  }
}
