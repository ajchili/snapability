const Clarifai = require('clarifai');
const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'snapability-220017';

const saveToDataStore = data => {
  const datastore = new Datastore({
    projectId
  });
  
  const kind = 'Predict';
  const predictKey = datastore.key(kind);
  
  const predict = {
    key: predictKey,
    data: {
      time: new Date().getTime(),
      ...data
    },
  };
  
  datastore
    .save(predict)
    .then(() => console.log(`Saved ${predict.key.name}: ${predict.data.description}`))
    .catch(err => console.error('ERROR:', err));
};

exports.predictImage = (req, res) => {
  cors(req, res, () => {
    if (req.method != 'POST') {
      res.status(404).send('Method must be POST!');
    } else if (!req.body.url) {
      res.status(400).send('Missing url!');
    } else {
      const app = new Clarifai.App({
        apiKey: process.env.CLARIFAI_API_KEY
      });
  
      app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa9ca48295b37401f8af92ad1af0d91d"})
        .then(generalModel => {
          return generalModel.predict(req.body.url);
        })
        .then(response => {
          let concepts = response['outputs'][0]['data']['concepts'];
          res.status(200).json(concepts);
          saveToDataStore({
            url: req.body.url,
            concepts
          });
        })
        .catch(err => {
          console.error(`Error parsing ${req.body.url}`, err);
          res.status(500).send(`Unable to predict ${req.body.url}.`);
        });
    }
  });
};