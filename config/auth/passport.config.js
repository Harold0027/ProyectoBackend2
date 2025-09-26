import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../models/user.model.js";

// Extractor de cookie: debe coincidir con el nombre que usas en login
function cookieExtractor(req) {
    if (req && req.cookies && req.cookies.jwt) {
        return req.cookies.jwt;
    }
    return null;
}

export function initPassport() {
    passport.use(
        "jwt-cookie",
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.JWT_SECRET
            },
            async (payload, done) => {
                try {
                    // payload.id coincide con lo que envías al crear el token
                    const user = await User.findById(payload.id).lean();
                    if (!user) return done(null, false);
                    return done(null, {
                        _id: user._id,
                        email: user.email,
                        role: user.role
                    });
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    // Para sesiones, si decides usar passport.session
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).lean();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}
