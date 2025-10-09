const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getNumericParam = (req, ...keys) => {
    const val = keys.map(k => req?.params?.[k]).find(v => v !== undefined);
    const num = Number(val);
    return isNaN(num) ? null : num;
};

const normalizeStatus = s => {
    const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
    return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const authorizeProjectOwner = (req, res, project) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }
    if (project.userId !== req.user.id) {
        res.status(403).json({ message: 'No autorizado.' });
        return false;
    }
    return true;
};

export async function index(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId', 'id');
        if (projectId === null) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const projectTasks = tasks.filter(task => task.projectId === projectId);
        return res.status(200).json(projectTasks);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId', 'id');
        if (projectId === null) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const { name, description, status } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'El campo "name" es requerido y no puede estar vacío.' });
        }
        if (description !== undefined && typeof description !== 'string' && description !== null) {
            return res.status(400).json({ message: 'El campo "description" debe ser una cadena de texto o nulo.' });
        }
        if (status !== undefined && typeof status !== 'string') {
             return res.status(400).json({ message: 'El campo "status" debe ser una cadena de texto.' });
        }

        const newTask = {
            id: MEM.seq.task++,
            projectId: projectId,
            userId: req.user.id,
            name: name,
            description: description || null,
            status: normalizeStatus(status || 'pending'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tasks.push(newTask);

        return res.status(201).json(newTask);
    } catch (e) {
        return next(e);
    }
}

export async function show(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId');
        const taskId = getNumericParam(req, 'task', 'taskId', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId');
        const taskId = getNumericParam(req, 'task', 'taskId', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        const task = tasks[taskIndex];
        const { name, description, status } = req.body;

        if (name !== undefined) {
             if (typeof name !== 'string' || name.trim() === '') {
                 return res.status(400).json({ message: 'El campo "name" no puede estar vacío.' });
             }
            task.name = name;
        }
        if (description !== undefined) {
            if (typeof description !== 'string' && description !== null) {
                return res.status(400).json({ message: 'El campo "description" debe ser una cadena de texto o nulo.' });
            }
            task.description = description;
        }
        if (status !== undefined) {
            if (typeof status !== 'string') {
                 return res.status(400).json({ message: 'El campo "status" debe ser una cadena de texto.' });
            }
            task.status = normalizeStatus(status);
        }

        task.updatedAt = new Date().toISOString();
        tasks[taskIndex] = task;

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId');
        const taskId = getNumericParam(req, 'task', 'taskId', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        tasks.splice(taskIndex, 1);

        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const projectId = getNumericParam(req, 'project', 'projectId');
        const taskId = getNumericParam(req, 'task', 'taskId', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeProjectOwner(req, res, project)) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        const { status } = req.body;

        if (!status || typeof status !== 'string') {
            return res.status(400).json({ message: 'El campo "status" es requerido y debe ser una cadena de texto.' });
        }

        const normalizedStatus = normalizeStatus(status);
        if (!['pending', 'in-progress', 'completed'].includes(normalizedStatus)) {
            return res.status(400).json({ message: 'El estado proporcionado no es válido. Los estados permitidos son: pending, in-progress, completed.' });
        }

        const task = tasks[taskIndex];
        task.status = normalizedStatus;
        task.updatedAt = new Date().toISOString();
        tasks[taskIndex] = task;

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export default {
    index,
    store,
    show,
    update,
    destroy,
    changeStatus,
};

export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
