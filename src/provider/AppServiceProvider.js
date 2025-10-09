/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service Provider equivalent for Node.js.
 * This class handles registration of application services and booting global hooks.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This is where you typically bind services into the application's DI container.
   *
   * @param {any} app - The application container/instance (e.g., an InversifyJS container, or a simple object).
   * @param {object} deps - An object containing dependencies that might be needed for registration (e.g., configuration, other providers).
   */
  static register(app, deps = {}) {
    // TODO: registrar servicios, singletons, bindings
    // Esto simula la funcionalidad de $this->app->bind() o $this->app->singleton() en Laravel.
    // Ejemplo:
    // app.singleton('UserRepository', () => new UserRepository(deps.database));
    // app.bind('UserService', () => new UserService(app.make('UserRepository')));
    // deps.config.set('app.name', 'My Node.js App');
  }

  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered.
   * Use it for global hooks, event subscriptions, or other post-registration setup.
   *
   * @param {any} app - The application container/instance.
   * @param {object} deps - An object containing dependencies (e.g., eventBus, configuration, other services).
   */
  static boot(app, deps = {}) {
    // TODO: hooks post-registro (p.ej. suscribir eventos, registrar casts, macros, políticas de autorización si aplica).
    // Esto simula la funcionalidad de macros de colecciones, políticas de autorización, o listeners de eventos globales.
    // Ejemplo de un hook de evento global (asumiendo que `deps.eventBus` es un emisor de eventos):
    // if (deps.eventBus && typeof deps.eventBus.on === 'function') {
    //   deps.eventBus.on('app.initialized', () => console.log('Application has been fully booted.'));
    // }
    // Ejemplo de registro de una 'macro' o funcionalidad global:
    // if (app.has('StringHelper')) {
    //   app.make('StringHelper').macro('capitalizeWords', (str) => /* ... */);
    // }
  }
}
