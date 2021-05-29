const axios = require('axios')
const fs = require('fs')

const pjson = require('../package.json')
const { convertData, convertNum } = require('../float-utils-node.js')

const Classifier = artifacts.require("./Classifiers/SparsePerceptron");

module.exports = async function (deployer) {
  if (deployer.network === 'skipMigrations') {
    return;
  }
  // Information to persist to the database.
  const name = "IMDB Review Sentiment Classifier"
  const description = "A simple IMDB sentiment analysis model."
  const encoder = 'IMDB vocab'
  const modelInfo = {
    name,
    description,
    accuracy: '0.829',
    modelType: 'Classifier64',
    encoder,
  };

  const toFloat = 1E9;

//   // Low default times for testing.
//   const refundTimeS = 15;
//   const anyAddressClaimWaitTimeS = 20;
//   const ownerClaimWaitTimeS = 20;
  // Weight for deposit cost in wei.
  const costWeight = 1E15;

  const data = fs.readFileSync('./ml-models/imdb-sentiment-model.json', 'utf8');
  const model = JSON.parse(data);
  const { classifications } = model;
  const weights = convertData(model.weights, web3, toFloat);
  const initNumWords = 250;
  const numWordsPerUpdate = 250;

  console.log(`Deploying IMDB model with ${weights.length} weights.`);
  const intercept = convertNum(model.intercept || model.bias, web3, toFloat);
  const learningRate = convertNum(model.learningRate, web3, toFloat);

  
  
      return deployer.deploy(Classifier,
        classifications, weights.slice(0, initNumWords), intercept, learningRate,
        { gas: 7.9E6 }).then(async classifier => {
          console.log(`  Deployed classifier to ${classifier.address}.`);
          for (let i = initNumWords; i < weights.length; i += numWordsPerUpdate) {
            await classifier.initializeWeights(i,weights.slice(i, i + numWordsPerUpdate),
              { gas: 7.9E6 });
            console.log(`  Added ${i + numWordsPerUpdate} weights.`);
          }

          });
        
};
