const axios = require('axios');
const fs = require('fs');
const pjson = require('../package.json');

const { convertData, convertNum } = require('../float-utils-node.js');
const DensePerceptron = artifacts.require("./Classifiers/Perceptron");

module.exports = async function (deployer) {
  if (deployer.network === 'skipMigrations') {
    return;
  }
  const toFloat = 1E9;

  // Information to persist to the database.
  const name = "Hot Dog Classifier"
  const description = "Classifies pictures as hot dog or not hot dog."
  const encoder = 'MobileNetV2'
  const modelInfo = {
    name,
    description,
    accuracy: '0.63',
    modelType: 'Classifier64',
    encoder,
  };

  // Low default times for testing.
  const refundTimeWaitTimeS = 15;
  const anyAddressClaimWaitTimeS = 20;
  const ownerClaimWaitTimeS = 20;
  // Weight for deposit cost in wei.
  const costWeight = 1E15;

  const weightChunkSize = 450;

  // Model
  let model = fs.readFileSync('./ml-models/classifier-perceptron-400.json', 'utf8');
  model = JSON.parse(model);

  const { classifications, featureIndices } = model;
  const weights = convertData(model.weights, web3, toFloat);
  const intercept = convertNum(model.bias, web3, toFloat);
  const learningRate = convertNum(0.5, web3, toFloat);

  console.log(`Deploying Hot Dog classifier.`);
  console.log(` Deploying classifier with first ${Math.min(weights.length, weightChunkSize)} weights.`);
    return deployer.deploy(DensePerceptron,
      classifications, weights.slice(0, weightChunkSize), intercept, learningRate,
      // Block gasLimit by most miners as of May 2019.
      { gas: 8E6 }).then( async classifier=>{
 //Add remaining weights.
 for (let i = weightChunkSize; i < weights.length; i += weightChunkSize) {
  console.log(` Deploying classifier weights [${i}, ${Math.min(i + weightChunkSize, weights.length)}).`);
  await classifier.initializeWeights(weights.slice(i, i + weightChunkSize,{ gas: 7.9E6 }));
}

// Add feature indices to use.

if (featureIndices !== undefined) {
  if (featureIndices.length !== weights.length) {
    throw new Error("The number of features must match the number of weights.");
  }
  for (let i = 0; i < featureIndices.length; i += weightChunkSize) {
    console.log(` Deploying classifier feature indices [${i}, ${Math.min(i + weightChunkSize, featureIndices.length)}).`);
    // console.log(await classifier.weights(i,{ gas: 7.9E6 }))
    await classifier.addFeatureIndices(featureIndices.slice(i, i + weightChunkSize));
  }
}
      })

   
};
