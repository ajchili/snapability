// Authenticate via API Key
const tumblr = require("tumblr.js");
const cors = require("cors")({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'snapability-220017';

const saveToDataStore = data => {
  const datastore = new Datastore({
    projectId
  });
  
  const kind = 'Parse';
  const parseKey = datastore.key(kind);
  
  const parse = {
    key: parseKey,
    type: 'tumblr',
    data,
    time: new Date().getTime()
  };
  
  datastore
    .save(parse)
    .then(() => console.log(`Saved ${parse.key.name}: ${parse.data.description}`))
    .catch(err => console.error('ERROR:', err));
};

exports.parseTumblrPost = (req, res) => {
  cors(req, res, () => {
    if (req.method != "POST") {
      res.status(404).send("Method must be POST!");
    } else if (!req.body.username) {
      res.status(400).send("Missing username!");
    } else if (!req.body.postId) {
      res.status(400).send("Missing postId!");
    } else {
      var client = tumblr.createClient({
        consumer_key: process.env.CONSUMER_KEY
      });

      // Make the request
      client.blogPosts(req.body.username, { type: "photo", id: req.body.postId }, (
        err,
        data
      ) => {
        if (err) res.status(500).json(err);
        else {
          res.status(200).json(
            data.posts[0].photos.map(photo => {
              return photo.original_size.url;
            })
          );
          saveToDataStore({
            url: req.body.url,
            srcs: data.posts[0].photos.map(photo => {
              return photo.original_size.url;
            }),
            author: req.body.username,
            post: req.body.postId,
          });
        }
      });
    }
  });
};
