// Irritatingly importing the dependency graph here is order dependent.
import { Reply } from './lib/entity/Reply';
import { Post } from './lib/entity/Post';
import { Subject } from './lib/entity/Subject';
import { User } from './lib/entity/User';

import { DataSource } from "typeorm"

var datasource = null;

export const entities = {
  Post: Post,
  Reply: Reply,
  Subject: Subject,
  User: User,
};

export async function createConnection(config: any) {
  datasource = new DataSource({
    type: config.type,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: [Post, Reply, Subject, User],
  })

  datasource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!")
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })

  return datasource
}

export function getConnection() {
  return getConnection;
}

export default {
  createConnection,
  getConnection,
  entities
};
