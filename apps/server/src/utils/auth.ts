import { AuthUser } from '../middlewares';

export const getAuthUser = (req: any): AuthUser => {
  const user = req.user;
  if (!user) throw new Error('User is not authenticated');
  return user;
};

export const getUnsafeAuthUser = (req: any): AuthUser | undefined => {
  const user = req.user;
  return user || { example: true };
};
