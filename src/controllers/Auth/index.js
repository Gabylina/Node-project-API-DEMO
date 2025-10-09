const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;
const sessions = MEM.sessions;

// Simple "hash" function for password simulation
const hash = p => `${p}_hashed`;

// Helper to normalize email to lowercase
const strtolower = s => String(s ?? '').toLowerCase();

// Token generation helper as per prompt for register/login
const generateAuthToken = (email) => `mock_token_for_${strtolower(email)}`;

// Helper to extract token from various sources for logout
const extractToken = (req) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        token = req.headers['x-access-token'];
    }
    if (!token) {
        token = req.query?.token;
    }
    return token;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
        }

        const lowerEmail = strtolower(email);
        if (users.some(u => u.email === lowerEmail)) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hash(password), // Store hashed password
        };
        users.push(newUser);

        const token = generateAuthToken(email);
        sessions[token] = newUser.id; // Store session

        return res.status(201).json({
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            token,
        });
    } catch (e) {
        return next(e);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son requeridos.' });
        }

        const lowerEmail = strtolower(email);
        const user = users.find(u => u.email === lowerEmail);

        if (!user || hash(password) !== user.password) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateAuthToken(user.email);
        sessions[token] = user.id; // Store session

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (e) {
        return next(e);
    }
}

export async function me(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        // Assuming an auth middleware populated req.user with the user's ID
        const authenticatedUser = users.find(u => u.id === req.user.id);
        if (!authenticatedUser) {
            return res.status(401).json({ message: 'Usuario autenticado no encontrado.' });
        }

        return res.status(200).json({
            user: {
                id: authenticatedUser.id,
                name: authenticatedUser.name,
                email: authenticatedUser.email,
            },
        });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        if (sessions[token]) {
            delete sessions[token];
            return res.status(200).json({ message: 'Sesión cerrada' });
        } else {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }
    } catch (e) {
        return next(e);
    }
}

export default {
    register,
    login,
    me,
    logout,
};

export const __users = MEM.users;
