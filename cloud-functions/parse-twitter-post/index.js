const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.parseTwitterPost = (req, res) => {
  cors(req, res, () => {
    let url;

    switch (req.get('content-type')) {
      case 'application/json':
        url = req.body.url;
        break;
      case 'application/octet-stream':
        url = req.body.toString();
        break;
      case 'text/plain':
        url = req.body;
        break;
      case 'application/x-www-form-urlencoded':
        url = req.body.url;
        break;
    }

    if (req.method != 'POST') {
      res.status(404).send('Method must be POST!');
    } else if (!url) {
      res.status(400).send('Missing url!');
    } else {
      axios.get(url)
        .then(result => {
          let data = result.data;
          let tweetURL = data.split('AdaptiveMedia-photoContainer')[1].split('</div>')[0].split('data-image-url="')[1].split('"')[0];
          res.status(200).json({
            tweet: url,
            src: tweetURL
          });
        })
        .catch(err => res.status(500).send(err));
    }
  });
};