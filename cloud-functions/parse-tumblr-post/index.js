// Authenticate via API Key
const tumblr = require("tumblr.js");
const cors = require("cors")({ origin: true });

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
        }
      });
    }
  });
};
