/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
import { Project } from '../models/Project.js'; // ASUNCION: Ruta y nombre de tu modelo Project

export async function EnsureProjectOwner(req, res, next) {
    try {
        const projectId = req.params.project; // Obtiene el ID del proyecto de los parámetros de la ruta

        if (!projectId) {
            return res.status(400).json({ error: 'ID de proyecto no proporcionado.' });
        }

        // ASUNCION: Tu modelo Project tiene un método findById o similar
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado.' });
        }

        // ASUNCION: Un middleware de autenticación previo ha adjuntado el usuario a req.user
        if (!req.user || !req.user.id) {
            // Si el usuario no está autenticado, un 401 sería más apropiado.
            // Sin embargo, para mantener la semántica de "No autorizado" del abort(403) original, 
            // asumimos que el usuario está autenticado pero no tiene la ID necesaria.
            return res.status(401).json({ error: 'No autenticado.' });
        }

        if (project.user_id !== req.user.id) {
            return res.status(403).json({ error: 'No autorizado.' });
        }

        // Adjunta el objeto del proyecto a la solicitud para que los siguientes controladores puedan usarlo
        req.project = project;
        
        return next();
    } catch (error) {
        console.error('Error en el middleware EnsureProjectOwner:', error);
        // Pasa el error al siguiente middleware de manejo de errores de Express
        return next(error);
    }
}

}

export default { EnsureProjectOwner };