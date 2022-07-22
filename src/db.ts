import { createConnection as createTypeORMConnection, getConnection } from 'typeorm';
// Irritatingly importing the dependency graph here is order dependent.
import { Reply } from './entity/Reply';
import { Post } from './entity/Post';
import { Subject } from './entity/Subject';
import { User } from './entity/User';

const entities = {
  Post: Post,
  Reply: Reply,
  Subject: Subject,
  User: User,
};

async function createConnection(config: any) {
  config.entities = Object.values(entities);

  console.log("Starting database connection");
  let connection = await createTypeORMConnection(config);
  return connection;
}

export default {
  createConnection,
  getConnection,
  entities
};
