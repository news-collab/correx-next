import snoowrap from 'snoowrap';

export class Client {
  constructor(clientId, clientSecret, refreshToken) {
    this.client = new snoowrap({
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      userAgent: 'Correx for Reddit 1.0 by News Collab'
    });
  }

  async getMe() {
    return this.client.getMe();
  }

  async searchURL(url) {
    return this.client.search({
      query: `url:${url}`
    });
  }

  async reply(submissionId, comment) {
    return this.client.getSubmission(submissionId).reply(comment);
  }

  async commentReplies(commentId) {
    const comment = await this.client.getComment(commentId);

    if (!comment) {
      return [];
    }
    return await comment.expandReplies({ limit: 20, depth: 1 });
  }
}
