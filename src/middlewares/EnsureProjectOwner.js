/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
import { Project } from '../models/Project.js'; // Assuming your Project model/service is defined here

export async function EnsureProjectOwner(req, res, next) {
  try {
    const projectId = req.params.project; // Gets 'project' parameter from the route (e.g., /projects/:project)

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    // Find the project in your database.
    // Replace `Project.findById` with your actual ORM call (e.g., `prisma.project.findUnique({ where: { id: projectId } })` or `await Project.findByPk(projectId)`).
    // This example assumes `Project.findById` will return null/undefined if not found.
    const project = await Project.findById(projectId);

    if (!project) {
      // If the project is not found (corresponds to Laravel's `findOrFail` throwing a 404)
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    // Ensure `req.user` is populated by a preceding authentication middleware (e.g., JWT, Passport.js).
    // It should contain the authenticated user's ID (e.g., `req.user.id`).
    if (!req.user || !req.user.id) {
      // This means the user is not authenticated or the auth middleware failed.
      // It's often handled by a separate authentication middleware before this one.
      return res.status(401).json({ error: 'No autenticado.' });
    }

    // Check if the authenticated user is the owner of the project
    if (project.user_id !== req.user.id) {
      // Corresponds to Laravel's `abort(403, 'No autorizado.')`
      return res.status(403).json({ error: 'No autorizado.' });
    }

    // Attach the found project object to the request for subsequent handlers (controllers, other middlewares)
    // Corresponds to Laravel's `$request->attributes->set('project', $project);`
    req.project = project;

    // Continue to the next middleware or route handler
    return next();
  } catch (error) {
    // Catch any unexpected errors during project retrieval (e.g., database connection issues, ORM specific errors).
    console.error('Error in EnsureProjectOwner middleware:', error);

    // More specific error handling could be added here if your ORM throws distinct error types.
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

}

export default { EnsureProjectOwner };