const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.parseInstagramPost = (req, res) => {
  cors(req, res, () => {
    if (req.method != "POST") {
      res.status(404).send("Method must be POST!");
    } else if (!req.body.url) {
      res.status(400).send("Missing url!");
    } else {
      axios
        .get(req.body.url)
        .then(result => {
          let data = result.data;
          let src = data
            .split('<meta property="og:image" content="')[1]
            .split('"')[0];
          res.status(200).json({
            post: req.body.url,
            src
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  });
};
