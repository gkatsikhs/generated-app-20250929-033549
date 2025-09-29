import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'
// Define a type for the application's environment variables and context variables
type AppEnv = {
  Bindings: {
    AUTH0_JWKS_URL: string;
    AUTH0_AUDIENCE: string;
    AUTH0_ISSUER_BASE_URL: string;
  };
  Variables: {
    authUser: AuthUser;
  };
};
interface AuthUser {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  name?: string;
  nickname?: string;
  email: string;
  picture?: string;
}
export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.AUTH0_JWKS_URL,
    alg: 'RS256',
    // FIX: 'audience' and 'issuer' must be inside a 'verification' object
    verification: {
      audience: c.env.AUTH0_AUDIENCE,
      issuer: c.env.AUTH0_ISSUER_BASE_URL,
    }
  });
  // Apply the middleware. If it fails, it will throw an error.
  // If it succeeds, we proceed to the next part.
  return jwtMiddleware(c, async () => {
    const payload = c.get('jwtPayload') as AuthUser;
    c.set('authUser', payload);
    await next();
  });
});