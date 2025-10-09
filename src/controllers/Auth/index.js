const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Simple "hashing" function
const hash = p => `${p}_hashed`;

// Simple token generation (base64url-like mock for 32 random bytes)
const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `mtok.${result}`;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
        }

        const lowerEmail = email.toLowerCase();
        if (users.some(u => u.email === lowerEmail)) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hash(password), // Store hashed password
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);

        const token = generateToken();
        MEM.sessions[token] = newUser.id;

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token
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

        const lowerEmail = email.toLowerCase();
        const user = users.find(u => u.email === lowerEmail);

        if (!user || hash(password) !== user.password) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken();
        MEM.sessions[token] = user.id;

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
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

        const user = users.find(u => u.id === req.user.id);

        if (!user) { // Should not happen if req.user is populated from a valid session
             return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        let token = null;

        // Extract token from Authorization header (Bearer)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        // Fallback to x-access-token header
        if (!token && req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        // Fallback to query parameter
        if (!token && req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        if (MEM.sessions[token]) {
            delete MEM.sessions[token];
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