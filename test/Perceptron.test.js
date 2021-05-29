
// const Perceptron = artifacts.require("./Classifier/SparsePerceptron")
// const ImdbVocab = require('../data/imdb.json')
// const web=   require('../getWeb3')

// contract('Perceptron',async (accounts)=>{
//     before( async () =>{
//         this.perceptron = await Perceptron.deployed()
//         this.web3 = await web.getWeb3()
//         this.vocab = [];
        
//         Object.entries(ImdbVocab).forEach(([key, value]) => {
//         this.vocab[value] = key;
        
//       });
//     })

//     const transformInput = async function(query){
//       const tokens = query.toLocaleLowerCase('en').split(/\s+/)
//       return tokens.map(t => {
//         let idx = ImdbVocab[t];
//         if (idx === undefined) {
//           // TOOD Add to vocab.
//           return 1337;
//         }
//         return idx;
//       }).map(v => this.web3.utils.toHex(v));
//     }

//     it("Encode my message",async ()=>{
//         const message = "Avoid the movie"
//         let _data = await transformInput(message) ;
//         let val = await this.perceptron.predict(_data)
//         print(val)
//     })
// })

// function print(message){console.log(message)}


const Perceptron = artifacts.require("./Classifier/Perceptron")

const mobilenet = require( '@tensorflow-models/mobilenet')

const tf = require('@tensorflow/tfjs-node');
const web=   require('../getWeb3')
const can= require('canvas');

contract('Perceptron',async (accounts)=>{
    var perceptron = undefined
    var toFloat =undefined
    // var web3 = undefined
    // var featureIndices = []
    // var featureIndices_length =undefined
    before( async () =>{
      this.test_image = await can.loadImage("/home/starlord/Desktop/0xDeCA10B-main/demo/client/src/ml-models/hot_dog-not/output/train/Normal/IM-0137-0001.jpeg")
        perceptron = await Perceptron.deployed()
        // web3 = await web3.getWeb3()
        this.web3 = await web.getWeb3() 
        toFloat = await perceptron.toFloat().then(parseInt)
        // featureIndices_length = perceptron.getNumFeatureIndices();
        this.featureIndices_length = await perceptron.getNumFeatureIndices().then(parseInt);
        featureIndices= []
        for (let i =0;i<this.featureIndices_length;i++){
          featureIndices[i] = await perceptron.featureIndices(i).then(parseInt)
        }
        


   
    })
    async function normalize(data) {
      var convertedData = data.map(x => Math.round(x * toFloat));
      var norm = await perceptron.norm(convertedData.map(v => this.web3.utils.toHex(v)))
      norm = this.web3.utils.toBN(norm);
      const _toFloat = this.web3.utils.toBN(toFloat);
        return convertedData.map(v => this.web3.utils.toBN(v).mul(_toFloat).div(norm));
        }


        async function predict(data){
          return await perceptron.predict(data);
        }
      it("Predict Covid",async( )=>{
        
        this.encoded_data =await  mobilenet.load({
          version: 2,
          alpha: 1,
        }).then(model => {
          const canvas = can.createCanvas(this.test_image.width, this.test_image.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(this.test_image, 0, 0);
          const imgElement = canvas
            if (Array.isArray(imgElement)) {w
              // Assume this is for data already in the database.
              return imgElement;
            }
            const imgEmbedding = model.infer(imgElement, { embedding: true });
       
            let embedding = tf.tidy(_ => {
              const embedding = imgEmbedding.gather(0);
              if (featureIndices !== undefined && featureIndices.length > 0) {
                return embedding.gather(featureIndices).arraySync();
              }
              return embedding.arraySync();
            });
            imgEmbedding.dispose();
            return normalize(embedding).then(normalizedEmbedding => {
              return normalizedEmbedding.map(v => this.web3.utils.toHex(v));
            });
            
          
      });
        var result = await predict(this.encoded_data).then(parseInt)
        print(result)
      })
    })
  

function print(message){console.log(message)}