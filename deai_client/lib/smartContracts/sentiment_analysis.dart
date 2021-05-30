// @dart=2.9
import 'dart:convert';
import 'dart:js_util';

import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web3_provider/ethers.dart';
import 'package:provider/provider.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';
import 'package:web_socket_channel/io.dart';
class NewContractLinking  {
    Web3Provider provider;
   String _abiCode;
   String _contractAddress;

  Contract _newContract;
  int num_of_weights = 400;
  int count=0;
  var weights = [];



  initialSetup(Web3Provider _provider) async {
 
  this.provider  = _provider;
    await getAbi();
     await getDeployedContract();
      // await getCredentials();
  }

  Future<void> getAbi() async {
    // Reading the contract abi
    String abiStringFile = await rootBundle.loadString("assets/SparsePerceptron.json");
    var jsonAbi = jsonDecode(abiStringFile);
    _abiCode = jsonEncode(jsonAbi["abi"]);
    _contractAddress =jsonAbi["networks"]["5777"]["address"];
  }

 

  Future<void> getDeployedContract() async {
    // Telling Web3dart where our contract is declared.

    const _contractAbi = [
     "function addFeatureIndices(uint32[])",
     "function classifications(uint) view returns (string)",
     "function featureIndices(uint256) view returns (uint32)",
     "function getNumClassifications() view returns (int256)",
     "function getNumFeatureIndices() view returns (int256)",
     "function intercept() view returns (int80)",
     "function learningRate() view returns (int32)",
     "function owner() view returns (address)",
     "function toFloat() view returns (uint32)",
     "function transferOwnership(address) ",
     "function weights(uint64) view returns (int80)",
     "function initializeWeights(uint64,int80[])",
     "function initializeSparseWeights(int80[])",
     "function norm(uint256)",
     "function predict(int64[]) view returns (uint64)",
     "function update(int64[],uint64) payable returns (uint64)",
     "function evaluateBatch(uint24[60][],uint64[]) view returns(uint256)"
    ];
   _newContract = Contract(_contractAddress, _contractAbi, provider);
    // Extracting the functions, declared in contract.
    // await getWeights();
    await predict("Great movie");
   
  }
  getToFloat() async{
    return promiseToFuture(callMethod(_newContract,"toFloat",[])).then((value) => int.parse(value.toString()));
  }

  getWeights() async{
    int margin = getToFloat();
    try{
      for(int i=1;i<=num_of_weights;i++){
        
       var currentName = promiseToFuture(callMethod(_newContract,"weights", [i]));
       await currentName.then((value) => weights.add(int.parse(value.toString())/margin));
        }
        print(weights);}
        catch(e){
          print(e);
        }
  }

  predict(String message) async {
    var encoder = jsonDecode(  await rootBundle.loadString("assets/imdb.json"));
  
    var tokens = message.split(" ");
    var encodings=[];
    var hex = [];
    await tokens.forEach((element)=>encodings.add(int.parse(encoder[element.toLowerCase()].toString()!=null?encoder[element.toLowerCase()].toString():"1337",radix:16)));
    
     var result  = promiseToFuture(callMethod(_newContract, "predict", [encodings]));
     int prediction;
    await result.then((value) => prediction = (int.parse(value.toString())));
    return prediction;
  }

   train(String message,int classification) async {
    
  var _contract = await _newContract.connect(provider.getSigner());
    var encoder = jsonDecode(  await rootBundle.loadString("assets/imdb.json"));
  
    var tokens = message.split(" ");
    var encodings=[];
    await tokens.forEach((element)=>encodings.add(int.parse(encoder[element.toLowerCase()].toString()!=null?encoder[element.toLowerCase()].toString():"1337",radix:16)));
    print(encodings);
      dynamic res = await promiseToFuture(callMethod(_contract, "update", [encodings,classification ]));
     int val=1;
    //await res.then((value) => print(int.parse(value.toString())));
    print(int.parse(res.toString()));
    return val;
  }

//  setTask(String message) async {
    

  // var res =
  //   await promiseToFuture(callMethod(_contract, "createTask", [
  //   message
  //   ]));
    
//       }
  
}

