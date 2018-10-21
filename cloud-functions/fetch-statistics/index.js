const cors = require("cors")({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'snapability-220017';

exports.fetchStatistics = (req, res) => {
  cors(req, res, () => {
    const datastore = new Datastore({
      projectId
    });

    if (req.method !== 'GET') {
      res.status(405).send('Method must be GET!');
    } else {
      Promise.all([datastore.runQuery(datastore.createQuery('Parse')), datastore.runQuery(datastore.createQuery('Predict'))])
        .then(results => {
          res.status(200).json(results);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json(err);
        });
    }
  });
}