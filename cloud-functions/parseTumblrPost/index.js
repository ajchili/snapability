// Authenticate via API Key
const tumblr = require("tumblr.js");
const cors = require("cors")({ origin: true });

exports.parseTumblrPost = (req, res) => {
  cors(req, res, () => {
    if (req.method != "POST") {
      res.status(404).send("Method must be POST!");
    } else if (!req.body.url) {
      res.status(400).send("Missing url!");
    } else {
      let username = req.body.url.split("://")[1].split("/")[0];
      let postID = req.body.url.split("post/")[1];
      if (postID.includes("/")) {
        postID = postID.split("/")[0];
      }
      var client = tumblr.createClient({
        consumer_key: process.env.CONSUMER_KEY
      });

      // Make the request
      client.blogPosts(username, { type: "photo", id: postID }, function(
        err,
        data
      ) {
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
