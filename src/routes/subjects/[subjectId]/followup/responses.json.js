import db from '../../../../db.ts';
import { sendTweets } from "@/twitterV2";

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
    const responseData = req.body.responses;
    if (responseData && responseData.length > 0) {
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

      let tweetData = {
        status: responseData[0].status,
      }

      if (responseData[0].in_reply_to_status_id) {
        tweetData.in_reply_to_status_id = responseData[0].in_reply_to_status_id;
        tweetData.auto_populate_reply_metadata = true;
      }

      const sentTweets = await sendTweets(tweetData, user);
      // NEED TO RECORD THE RESPONSES
      /*
      const sentTweets = {
        "created_at":"Fri May 15 20:26:05 +0000 2020",
        "id":1261392428574994400,
        "id_str":"1261392428574994432",
        "text":"@dancow derp",
        "truncated":false,
        "entities": {
          "hashtags":[],
          "symbols":[],
          "user_mentions":[
            {"screen_name":"dancow","name":"Dan Nguyen","id":14335332,"id_str":"14335332","indices":[0,7]}
          ],
          "urls":[]
          },
          "source":"<a href=\"https://knowtheory.net\" rel=\"nofollow\">Correx</a>",
          "in_reply_to_status_id":1260960425526677500,
          "in_reply_to_status_id_str":"1260960425526677506",
          "in_reply_to_user_id":14335332,
          "in_reply_to_user_id_str":"14335332",
          "in_reply_to_screen_name":"dancow",
          "user":{
            "id":14227842,
            "id_str":"14227842",
            "name":"Ted Han ★",
            "screen_name":"knowtheory",
            "location":"Oakland",
            "description":"(he/him) consults on product, journalism, & civics | @news_collab | @AAJA board | previously, @documentcloud, @ire_nicar, videojuicer 🐲 hic sunt dracones 🐲","url":"https://t.co/2Xig4upGJL","entities":{"url":{"urls":[{"url":"https://t.co/2Xig4upGJL","expanded_url":"https://knowtheory.net","display_url":"knowtheory.net","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":4748,"friends_count":5220,"listed_count":355,"created_at":"Wed Mar 26 17:37:11 +0000 2008","favourites_count":90339,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":72974,"lang":null,"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"000000","profile_background_image_url":"http://abs.twimg.com/images/themes/theme7/bg.gif","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme7/bg.gif","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/785165143260880896/kSNbiUDD_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/785165143260880896/kSNbiUDD_normal.jpg","profile_banner_url":"https://pbs.twimg.com/profile_banners/14227842/1476033184","profile_link_color":"ABB8C2","profile_sidebar_border_color":"181A1E","profile_sidebar_fill_color":"252429","profile_text_color":"666666","profile_use_background_image":true,"has_extended_profile":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none"},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":0,"favorite_count":0,"favorited":false,"retweeted":false,"lang":"in"
        };
        */

      if (sentTweets) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          responses: sentTweets
        }));
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
      console.log(`params: ${JSON.stringify(req.body)}`);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Submitted data must include a "responses" key.' }));
    }
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }

}
