const Clarifai = require('clarifai');

exports.predictImage = (req, res) => {
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
    const app = new Clarifai.App({
      apiKey: process.env.CLARIFAI_API_KEY
    });

    app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict(url);
      })
      .then(response => {
        let concepts = response['outputs'][0]['data']['concepts'];
        res.status(200).json(concepts);
      })
      .catch(err => {
        console.error(`Error parsing ${url}`, err);
        res.status(500).send(`Unable to predict ${url}.`);
      });
  }
};