import snoowrap from 'snoowrap';

export class Client {
  constructor(clientId, clientSecret, refreshToken) {
    this.client = new snoowrap({
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      userAgent: 'Correx for Reddit 1.0 by News Collab',
    });
  }

  async getMe() {
    return this.client.getMe();
  }
}
