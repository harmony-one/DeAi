import 'package:async/src/result/result.dart';

import 'package:cubit/cubit.dart';
import 'package:deai_client/smartContracts/sentiment_analysis.dart';
import 'package:deai_client/state_management/contract_state.dart';
import 'package:flutter_web3_provider/ethers.dart';


class ContractCubit extends Cubit<ContractState> {
  final NewContractLinking contractLinking;

  ContractCubit(this.contractLinking) : super(IntialState());

  startContract(Web3Provider provider) async{
    
    await this.contractLinking.initialSetup(provider);
    //await getTasks();
    emit(StartContractState());
  }

  predict(String message) async {
    _startLoading();
    try{
   var result = await this.contractLinking.predict(message) ;
   
   emit(PredictState(result));
   }
   catch(e){
      emit(ErrorState(e.toString()));}
    
  }
train(String message,int classification) async {
    _startLoading();
    try{
   var result = await this.contractLinking.train(message,classification) ;
   
   emit(TrainState(result));
   }
   catch(e){
      emit(ErrorState(e.toString()));}
    
  }
  
  void _startLoading(){
    emit(LoadingState());
  }
  
}
