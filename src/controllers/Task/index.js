const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const getProjectId = (req) => Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
const getTaskId = (req) => Number(req.params?.task ?? req.params?.taskId ?? req.params?.id);

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const { name, description, status: rawStatus } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'El nombre de la tarea es requerido.' });
    }

    const status = normalizeStatus(rawStatus ?? 'pending');
    const now = new Date().toISOString();

    const newTask = {
      id: MEM.seq.task++,
      projectId,
      userId: req.user.id,
      name: name.trim(),
      description: description ? String(description).trim() : null,
      status,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    const taskId = getTaskId(req);

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    const taskId = getTaskId(req);

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { name, description, status: rawStatus } = req.body;
    let hasChanges = false;

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (trimmedName === '') {
        return res.status(400).json({ message: 'El nombre de la tarea no puede estar vacío.' });
      }
      if (trimmedName !== task.name) {
        task.name = trimmedName;
        hasChanges = true;
      }
    }

    if (description !== undefined) {
      const trimmedDescription = description ? String(description).trim() : null;
      if (trimmedDescription !== task.description) {
        task.description = trimmedDescription;
        hasChanges = true;
      }
    }
    
    if (rawStatus !== undefined) {
      const newStatus = normalizeStatus(rawStatus);
      if (newStatus !== task.status) {
        task.status = newStatus;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      task.updatedAt = new Date().toISOString();
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    const taskId = getTaskId(req);

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    const taskId = getTaskId(req);

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (req.user.id !== project.userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { status: rawStatus } = req.body;
    if (rawStatus === undefined) {
      return res.status(400).json({ message: 'El estado es requerido.' });
    }

    const newStatus = normalizeStatus(rawStatus);
    if (newStatus === task.status) {
      return res.status(200).json(task);
    }

    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

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

export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
