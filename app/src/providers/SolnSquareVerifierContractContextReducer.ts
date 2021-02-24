type IAction = {type: 'SET_CONTRACT'; payload: ISolnSquareVerifier} | {type: 'GET_CONTRACT'};

export interface IState {
  contract?: ISolnSquareVerifier;
  error?: string;
  loading: boolean;
  status: 'initial' | 'loading' | 'error' | 'success';
}

export const initialState: IState = {
  contract: undefined,
  error: undefined,
  loading: false,
  status: 'initial',
};

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'SET_CONTRACT':
      return {
        ...state,
        status: 'success' as 'success',
        contract: action.payload,
        loading: false,
        error: undefined,
      };
    case 'GET_CONTRACT':
      return {
        ...state,
        status: 'loading' as 'loading',
        loading: true,
        error: undefined,
        contract: undefined,
      };
    default:
      return state;
  }
};

export interface ISolnSquareVerifier {
  mint: any;
}
