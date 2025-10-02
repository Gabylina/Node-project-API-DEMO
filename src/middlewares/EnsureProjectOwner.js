/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
import Project from '../models/Project.js'; // Adjust path and model import as needed for your ORM/structure.

/**
 * Middleware to ensure the authenticated user owns the project specified in the route parameters.
 * If successful, it attaches the found project object to `req.project` for downstream use.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
export async function EnsureProjectOwner(req, res, next) {
  try {
    // Extract the project ID from the route parameters. This corresponds to Laravel's $request->route('project').
    // Assumes your route is defined like `/projects/:project`.
    const projectId = req.params.project;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required in route parameters.' });
    }

    // Find the project by its ID. This simulates Laravel's Project::findOrFail($projectId).
    // Replace `Project.findById(projectId)` with your actual ORM call (e.g., Mongoose, Prisma, Sequelize).
    // Example: `const project = await prisma.project.findUnique({ where: { id: projectId } });`
    const project = await Project.findById(projectId);

    if (!project) {
      // If the project is not found, respond with a 404 Not Found status.
      // This behavior mimics `findOrFail` throwing an exception if the model isn't found.
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Ensure `req.user` is populated by a preceding authentication middleware.
    // Compare the project's owner ID with the authenticated user's ID.
    // Laravel's `$request->user()->id` maps to `req.user.id`.
    if (!req.user || project.user_id !== req.user.id) {
      // If the user is not authenticated or not the owner, respond with 403 Forbidden.
      return res.status(403).json({ error: 'No autorizado.' }); // Corresponds to Laravel's abort(403, 'No autorizado.')
    }

    // Attach the retrieved project object to the request object.
    // This makes the project easily accessible in subsequent middleware or route handlers.
    // This is equivalent to Laravel's `$request->attributes->set('project', $project)`.
    req.project = project;

    // If all checks pass, proceed to the next middleware or route handler.
    return next();
  } catch (error) {
    // Log the error for debugging purposes (e.g., database connection issues, malformed IDs).
    console.error('Error in EnsureProjectOwner middleware:', error);

    // Handle specific ORM errors, such as an invalid ID format.
    // For example, Mongoose throws a 'CastError' if an invalid ObjectId is provided.
    if (error.name === 'CastError' || error.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid Project ID format.' });
    }

    // For any other unexpected errors, send a 500 Internal Server Error response.
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

}

export default { EnsureProjectOwner };