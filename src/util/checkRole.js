/**
 * Middleware per il controllo dei permessi (Role-Based Access Control)
 * @param {Array<string>} allowedTypes - Tipi di utente permessi (es. ['comu', 'asso'])
 * @param {boolean} requireAdmin - Se true, l'utente deve essere anche admin
 */
const checkRole = (allowedTypes, requireAdmin = false) => {
    return (req, res, next) => {
        // 1. Verifica che l'autenticazione sia avvenuta (req.loggedUser deve esistere)
        if (!req.loggedUser) {
            return res.status(401).json({ error: req.t('auth.unauthorized') });
        }

        const user = req.loggedUser;

        // 2. Controllo del TIPO (Sei Comune? Sei Associazione?)
        if (!allowedTypes.includes(user.tipo)) {
            return res.status(403).json({ 
                error: req.t('auth.unauthorized_role')
            });
        }

        // 3. Controllo ADMIN (Se richiesto)
        // Se la rotta richiede admin (requireAdmin=true) e l'utente non lo è (!user.admin) -> Errore
        if (requireAdmin && !user.admin) {
            return res.status(403).json({ 
                error: req.t('auth.unauthorized_admin')
            });
        }

        next();
    };
};

module.exports = checkRole;
