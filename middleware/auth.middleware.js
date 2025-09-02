import passport from "passport";

export const requiereJwtCookie = passport.authenticate("jwt-cookie", { session: false });

export const requireRole = (...roles) => (req,res,next) => {
    if(!req.user) return res.status(401).json({ error: "No Autorizado" });
    if(!roles.includes(req.user.role)) return res.status(403).json({ error: "Prohibido el paso" });
    next();
};
