const jwt = require('jsonwebtoken');
const JWT_SECRET = '12345678'; // Usa la misma clave secreta

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).send('Token no proporcionado');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token no válido');
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
