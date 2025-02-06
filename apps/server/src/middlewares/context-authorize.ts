import { Logger } from '@nestjs/common';

export const contextAuthorizationMiddlware = async context => {
  const { req, connection } = context;
  if (connection) {
    return connection.context;
  } else if (req) {
    try {
      const regex = /Bearer (.+)/i;
      const authorizationToken = req.headers['authorization'];
      if (authorizationToken) {
        const idToken = authorizationToken.match(regex)?.[1];
        if (idToken) {
          console.log('not implemented');
        }
      }
      return { ...context, req };
    } catch (error: any) {
      new Logger('MIDDLEWARE').error(error.message);
      return { req };
    }
  }
};
