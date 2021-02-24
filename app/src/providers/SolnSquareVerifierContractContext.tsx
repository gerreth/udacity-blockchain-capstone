import React, {useContext, useEffect, useReducer} from 'react';

import {getProvider} from '../hooks/useWeb3';

import {
  ISolnSquareVerifier,
  initialState,
  IState,
  reducer,
} from './SolnSquareVerifierContractContextReducer';

const Contract = require('@truffle/contract');
const abi = require('../contracts/SolnSquareVerifier.json');

const SolnSquareVerifierContext = React.createContext<IState | undefined>(undefined);

export const SolnSquareVerifierProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const run = async () => {
      dispatch({type: 'GET_CONTRACT'});
      const contract = Contract(abi, '0x3554d748cB0104a108AeB31EdDB4F1A0EbC86521');
      const provider = await getProvider();

      contract.setProvider(provider);
      const instance = (await contract.deployed()) as ISolnSquareVerifier;
      dispatch({type: 'SET_CONTRACT', payload: instance});
    };

    run();
  }, []);

  return (
    <SolnSquareVerifierContext.Provider value={state}>
      {children}
    </SolnSquareVerifierContext.Provider>
  );
};

export const useSolnSquareVerifierContext = () => {
  const context = useContext(SolnSquareVerifierContext);

  if (context === undefined) {
    throw Error('Could not find provider of SolnSquareVerifierContext');
  }

  return context;
};

export default useSolnSquareVerifierContext;
