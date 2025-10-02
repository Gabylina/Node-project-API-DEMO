const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const getParamId = (req, ...keys) => {
  const param = keys.map(k => req.params?.[k]).find(v => v !== undefined);
  return Number(param);
};

export async function index(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (project.userId !== req.user.id) {
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
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la tarea es requerido.' });
    }

    const newTask = {
      id: MEM.seq.task++,
      projectId: projectId,
      userId: req.user.id,
      name: name,
      description: description ?? null,
      status: normalizeStatus(status ?? 'pending'),
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
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    const taskId = getParamId(req, 'task', 'taskId', 'id');

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

    if (project.userId !== req.user.id) {
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
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    const taskId = getParamId(req, 'task', 'taskId', 'id');

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

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { name, description, status } = req.body;

    if (name !== undefined) {
      if (!name) return res.status(400).json({ message: 'El nombre de la tarea no puede estar vacío.' });
      task.name = name;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = normalizeStatus(status);
    }

    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    const taskId = getParamId(req, 'task', 'taskId', 'id');

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

    if (project.userId !== req.user.id) {
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
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParamId(req, 'project', 'projectId', 'id');
    const taskId = getParamId(req, 'task', 'taskId', 'id');

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

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'El campo status es requerido.' });
    }

    task.status = normalizeStatus(status);
    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

const TaskController = {
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

export default TaskController;
