const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.parseTwitterPost = (req, res) => {
  cors(req, res, () => {
    if (req.method != 'POST') {
      res.status(404).send('Method must be POST!');
    } else if (!req.body.url) {
      res.status(400).send('Missing url!');
    } else {
      axios.get(req.body.url)
        .then(result => {
          let data = result.data;
          let tweetURL = data.split('AdaptiveMedia-photoContainer')[1].split('</div>')[0].split('data-image-url="')[1].split('"')[0];
          res.status(200).json({
            tweet: req.body.url,
            src: tweetURL
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err)
        });
    }
  });
};