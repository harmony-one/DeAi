

import 'package:equatable/equatable.dart';


abstract class ContractState extends Equatable{}

class IntialState extends ContractState{
  @override
  // TODO: implement props
  List<Object> get props => [];}
class StartContractState extends ContractState{
  @override
  // TODO: implement props
  List<Object> get props => [];}
  class LoadingState extends ContractState{
  @override
  // TODO: implement props
  List<Object> get props => [];

  }


  class PredictState extends ContractState{
  final int result;

  PredictState(this.result);
  @override
  // TODO: implement props
  List<Object> get props => [this.result];

  }

class TrainState extends ContractState{
  final int good_or_bad;

  TrainState(this.good_or_bad);
  @override
  // TODO: implement props
  List<Object> get props => [this.good_or_bad];

  }
 

  class ErrorState extends ContractState{
  final String error;
  ErrorState(this.error);
  @override
  // TODO: implement props
  List<Object> get props => [];

  }
