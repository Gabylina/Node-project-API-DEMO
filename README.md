# Proyecto Node.js – API Migrada desde Laravel

Este repositorio tiene como función servir como repositorio destino para recibir los archivos migrados desde Laravel mediante un flujo automatizado construido en n8n y utilizando el modelo de lenguaje Gemini.  
Forma parte del proyecto **“Migración Automatizada de Laravel a Node.js con n8n”**, desarrollado en el marco de una práctica profesional.


## 1. Propósito y contexto

El proyecto base en Node.js fue diseñado como una maqueta inicial con estructura Express, destinada a recibir el código migrado automáticamente.  
La segunda parte del repositorio corresponde al **resultado de la migración**, que incorpora los controles, rutas, modelos y otros componentes generados desde Laravel.


## 2. Estructura base del proyecto

La estructura original del proyecto fue creada manualmente antes de ejecutar la migración.  
Es importante no eliminar ni modificar estos archivos base, ya que permiten que la aplicación funcione correctamente y sirven como punto de referencia para el flujo automatizado.

### Descripción de archivos base

- `src/app.js`: configura la aplicación Express, middlewares globales y rutas base.
- `src/server.js`: inicia el servidor y lo mantiene escuchando en el puerto 3000.
- `.github/workflows/run-and-check.yml`: archivo de integración continua que valida la estructura del proyecto, levanta el servidor y ejecuta pruebas automáticas sobre los endpoints migrados.
- `.github/workflows/reset-to-base.yml`: flujo manual que elimina los archivos migrados y restaura el repositorio a su estado base, manteniendo solo los archivos esenciales.
- `package.json` / `package-lock.json`: definen dependencias y versiones fijas para evitar errores de instalación.

Estos archivos deben mantenerse intactos, ya que son fundamentales para que los controladores migrados puedan integrarse sin errores.


## 3. Requisitos previos

- Node.js versión 18 o superior  
- npm versión 9 o superior  
- Git  
- Postman o cualquier cliente HTTP (para pruebas manuales)


## 4. Instalación y configuración posterior a la migración

### 4.1 Antes de clonar o instalar el proyecto

Es importante verificar la migración ejecutando el flujo automático de validación en GitHub.

**Ejecutar el flujo de validación (`run-and-check.yml`):**

1. Ir a la pestaña **Actions** del repositorio en GitHub.  
2. Seleccionar el flujo **“Run API (smoke)”**.  
3. Presionar **Run workflow** y esperar a que finalice.

Este proceso verifica automáticamente que:

- Todos los archivos migrados estén presentes y sin errores.
- El servidor Express se levante correctamente.
- Los endpoints `/api/ping`, `/auth`, `/projects` y `/tasks` funcionen según lo esperado.

Si el flujo finaliza con **“Endpoint matrix OK”**, la migración fue exitosa y puedes continuar.

### **4.2 Clonar el repositorio**

- git clone https://github.com/Gabylina/Node-project-API-DEMO.git
- cd Node-project-API

### **4.3 Instalar dependencias**
- npm install

### **4.4 Levantar el servidor en modo desarrollo o producción**
- npm run dev / npm start

### **4.5 Verificar el endpoint base:**
- curl http://127.0.0.1:3000/api/ping

Si la respuesta es pong, el servidor está operativo.

### **4.6 Estructura después de la migración**
Una vez ejecutado el flujo de n8n, el repositorio incluye nuevos módulos generados desde Laravel.
Cada componente migrado mantiene las funciones equivalentes del proyecto Laravel:
- Auth: registro, inicio de sesión y autenticación mediante token.
- Projects: creación y consulta de proyectos por usuario autenticado.
- Tasks: gestión de tareas dentro de cada proyecto.
- Middlewares y Requests: validaciones y seguridad de rutas.
- Config: equivalentes de los archivos auth.php y sanctum.php fusionados en auth.js.

### **4.7 Pruebas automáticas (GitHub Actions)**
El archivo .github/workflows/run-and-check.yml ejecuta un flujo de pruebas automatizado para garantizar que el proyecto migrado sea funcional.
Flujo de verificación:
1. Instala dependencias (npm install).
2. Verifica la existencia de archivos críticos (app.js, server.js, routes, controllers).
3. Levanta el servidor en segundo plano.
4. Ejecuta pruebas sobre los endpoints:
    /api/ping
    /api/auth/register
    /api/auth/login
    /api/auth/me
    /api/projects
    /api/projects/:id/tasks
5. Confirma respuestas correctas (200, 201, 204).
6. Detiene el servidor y registra los logs.

Las pruebas se ejecutan automáticamente cuando se actualizan archivos dentro de src/, server.js, package.json, package-lock.json, o el propio workflow.

### **4.8 Pruebas manuales**
También se puede validar la API con Postman utilizando las siguientes rutas:

| Método | Ruta | Descripción |
|:-------|:-----|:------------|
| **GET** | `/api/ping` | Verifica que el servidor esté activo |
| **POST** | `/api/auth/register` | Crea un nuevo usuario |
| **POST** | `/api/auth/login` | Inicia sesión y genera token |
| **GET** | `/api/auth/me` | Devuelve los datos del usuario autenticado |
| **GET** | `/api/projects` | Lista los proyectos del usuario |
| **POST** | `/api/projects` | Crea un nuevo proyecto |
| **GET** | `/api/projects/:id/tasks` | Lista tareas de un proyecto |
| **POST** | `/api/projects/:id/tasks` | Crea una nueva tarea |
| **POST** | `/api/projects/:id/tasks/:task/status` | Cambia el estado de una tarea |


## 5. Relación con otros repositorios

Este proyecto funciona junto a los siguientes repositorios:
- Laravel-project-API: proyecto original en PHP utilizado como fuente.
- n8n-workflow-migration: flujo automatizado que toma el código Laravel, lo transforma y actualiza este repositorio.
  
El resultado final es una API funcional en Node.js, equivalente en estructura y comportamiento al sistema original en Laravel, validada automáticamente tras cada migración.

## 6. Recomendaciones finales

- No eliminar ni modificar los archivos base (app.js, server.js, index.js, workflows).
- Si se desea realizar una nueva migración completa desde cero, ejecutar el flujo “Reset to Base”(.github/workflows/reset-to-base.yml) antes de iniciar el proceso en n8n. Este flujo eliminará los archivos migrados y restaurará el repositorio a su estado original.
- Si se realizan cambios manuales en los controladores migrados, verificar su correcto funcionamiento antes de ejecutar un nuevo flujo de migración.

