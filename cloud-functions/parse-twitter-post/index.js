const axios = require('axios');
const cors = require('cors')({ origin: true });
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
    type: 'twitter',
    data,
    time: new Date().getTime()
  };
  
  datastore
    .save(parse)
    .then(() => console.log(`Saved ${parse.key.name}: ${parse.data.description}`))
    .catch(err => console.error('ERROR:', err));
};

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
          saveToDataStore({
            url: req.body.url,
            src: tweetURL,
            author: req.body.url.split('https://twitter.com/')[1].split('/')[0],
            post: req.body.url.split('status/')[1],
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err)
        });
    }
  });
};