# Laravel → Node.js Base de migración

## Descripción  
Este proyecto tiene como finalidad **automatizar la migración** de una API desarrollada en **Laravel** hacia **Node.js/Express** utilizando flujos de trabajo en **n8n**.  

El enfoque es que todo el código PHP (controladores, rutas, requests, middlewares, configuraciones, modelos, migraciones, etc.) sea procesado en **n8n**, convertido en su equivalente en Node.js y subido automáticamente a un repositorio destino en GitHub.  

De esta manera, se busca garantizar una migración **estandarizada, reproducible y con mínima intervención manual**, manteniendo convenciones predefinidas para asegurar compatibilidad en el resultado final.  

---

## Qué contiene este repositorio (base previa a la migración)  
Este repositorio **no contiene aún la API migrada**, sino una **base mínima en Node.js** que servirá de punto de partida para alojar los archivos generados por n8n.  

Actualmente incluye:  
- **Servidor Express.js** listo para usar, configurado para escuchar en el puerto 3000.  
- **Estructura inicial manual**:  
  - `src/app.js`: inicializa la aplicación con Express y middlewares básicos.  
  - `src/server.js`: arranca el servidor.  
  - `package.json`: define dependencias y scripts de ejecución (`npm start`, `npm run dev`).  
- **Rutas básicas ya implementadas**:  
  - `/api/ping`: endpoint de prueba para validar el estado del servidor.  
  - `/api/auth`: incluye registro, inicio/cierre de sesión y consulta de usuario autenticado.  
  - `/api/projects`: CRUD de proyectos.  
  - `/api/projects/:project/tasks`: gestión de tareas asociadas a proyectos.  
- **Validación automática en GitHub Actions**: cada push ejecuta un flujo de pruebas básicas sobre los endpoints principales.  

Todo lo demás (**controladores, modelos, middlewares adicionales, configuraciones completas, etc.**) será creado automáticamente a través de **n8n** a partir del código de Laravel.  

---

## Flujo de n8n: estructura y pasos principales  

### Disparo y contexto  
- **Manual Trigger** → inicia la ejecución del flujo.  
- **Set (Constantes)** → define parámetros clave: repositorio de origen (Laravel), repositorio destino (Node.js), branch y credenciales.  

### Ingesta del código Laravel  
- **List Tree (GitHub)** → obtiene la estructura completa de archivos.  
- **Explode Tree** → separa cada archivo en ítems individuales.  
- **If blob** → filtra para dejar solo archivos.  
- **If .php** → selecciona únicamente archivos PHP.  

### Clasificación de archivos  
- **Classify Type** → asigna tipo a cada archivo (controller, route, request, middleware, config, migration, etc.).  

### Descarga y preparación  
- **Get Blob** → descarga el contenido en Base64.  
- **Decode PHP** → transforma el archivo a texto legible.  
- Caso especial: **`auth.php` y `sanctum.php` se combinan en un solo `auth.js`**.  

### Generación de equivalentes en Node.js  
- **Build Gemini Prompt** → construye prompts distintos según el tipo de archivo.  
- **Gemini** → genera la conversión a Node.js en formato JSON.  
- **Parse Gemini JSON** → valida y corrige errores comunes (comillas, saltos de línea, formato inválido).  

### Post-parches (post-prepare)  
Ajustes automáticos que aseguran consistencia:  
- Rutas → imports con `.js`, router definido, export correcto.  
- Requests → validaciones estandarizadas y respuestas 422.  
- Middlewares → retornos claros (401 o next()), export seguro.  
- Models/Services → clases limpias y reutilizables.  

### Escritura en GitHub  
- **Prepare GitHub Content** → empaqueta los archivos en Base64.  
- **Get SHA** → determina si el archivo ya existe.  
- **PUT Create/Update** → crea o actualiza los archivos en la rama destino.  

Los commits llevan el formato: migrate(<tipo>): <ruta> [skip ci].


---

## 🎯 Objetivo final  
Al ejecutar el flujo completo en **n8n**, el repositorio destino contará con:  
- Una **API totalmente migrada** desde Laravel a Node.js/Express.  
- **Estructura modular** validada con pruebas automáticas.  
- Compatibilidad con convenciones estándar en **controladores, rutas, middlewares y modelos**.  

En otras palabras: lo que comienza aquí como una **base mínima en Node.js**, terminará siendo una **API completa migrada y lista para extender** en Node/Express gracias al proceso automatizado en n8n.  

---

✍️ **Autor**: Proyecto de migración automatizada con **n8n, Laravel y Node.js**.  
