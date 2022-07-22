import db from '../../../../db.ts';
import { getTweets } from "@/twitterV2";

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }
//console.log(uuid);

export async function get(req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    const { id } = req.params;
    const user = req.session.passport.user;

    const { Subject, Post, User } = db.entities;
    const connection = await db.getConnection(NODE_ENV);
    const SubjectRepository = connection.getRepository(Subject);
    const subject = await SubjectRepository.findOne({ where: { uuid: id }, relations: ["posts"] });

    res.end(JSON.stringify({
      // data should go here.
      posts: subject.posts
    }));

  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }
}

export async function post(req, res) {
  // only allow posting from authenticated users
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    // get the subject id
    const { id } = req.params;
    const postData = req.body.posts;
    if (postData && postData.length > 0) {
      // get the subject
      const { Subject, Post, User } = db.entities;
      const connection = await db.getConnection(NODE_ENV);
      const SubjectRepository = connection.getRepository(Subject);
      const subject = await SubjectRepository.findOne({
        where: {
          uuid: id,
          user: user // make sure the user has access to it.
        },
        relations: ["posts"]
      });

      // get the posts 
      const postIds = postData.map(post => post.id);
      let postsToUpdate = subject.posts.filter(post => postIds.find(id => id == post.id));
      // update the posts
      postsToUpdate.forEach(post => {
        const data = postData.find(d => d.id == post.id);
        Object.entries(data).forEach(([key, value]) => { post[key] = value; });
      });
      // save the posts
      const PostRepository = connection.getRepository(Post);
      const savedPosts = await PostRepository.save(postsToUpdate);

      if (savedPosts) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ posts: postsToUpdate }));
      } else {
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          message: `One of the two of us messed up`,
          log: subject
        }));
      }
    } else {
      console.log(`params: ${JSON.stringify(req.params)}`);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Submitted data must include a "posts" key.' }));
    }
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }

}
