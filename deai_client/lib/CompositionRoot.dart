import 'package:deai_client/screens/home.dart';
import 'package:deai_client/smartContracts/sentiment_analysis.dart';
import 'package:deai_client/state_management/contract_cubit.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_cubit/flutter_cubit.dart';

class CompositionRoot{
  static late NewContractLinking contractLinking;
  static configure() async{
    contractLinking = NewContractLinking();
   
  }
  static composeHomeUi(){
    ContractCubit contractCubit = ContractCubit(contractLinking);
    return CubitProvider(create: (BuildContext context) => contractCubit,child: Home(),);
  }
  
}