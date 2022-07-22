import * as dotenv from 'dotenv';
dotenv.config();

export function newClient(userAgent, clientId, clientSecret, refreshToken) {
  return new snoowrap({
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    userAgent: userAgent,
  });
}
