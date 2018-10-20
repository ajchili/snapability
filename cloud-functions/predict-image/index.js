const Clarifai = require('clarifai');

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.predictImage = (req, res) => {
  const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
   });
   
  res.status(403).send('Unfinsihed.');
};