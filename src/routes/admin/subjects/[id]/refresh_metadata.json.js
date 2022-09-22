import db from '@/db.ts';

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }

export async function post(req, res) {
  // only allow posting from authenticated users
  if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.admin) {
    const user = req.session.passport.user;
    const { id } = req.params;
    const { Subject } = db.entities;
    const connection = await db.getConnection(NODE_ENV);
    const SubjectRepository = connection.getRepository(Subject);
    const subject = await SubjectRepository.findOne({
      where: {
        uuid: id,
      },
    });

    subject.metadata = await subject.extractMetadata();
    const savedSubject = await SubjectRepository.save(subject);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ subject }));
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }

}
