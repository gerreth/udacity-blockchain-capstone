import React, {useState} from 'react';

import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider as SCThemeProvider} from 'styled-components';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import useWeb3Context, {Web3ContextProvider} from './providers/Web3Context';
import useSolnSquareVerifierContext, {
  SolnSquareVerifierProvider,
} from './providers/SolnSquareVerifierContractContext';

import './App.css';
import BoxTile from './components/cell/BoxTile';

const theme = createMuiTheme({
  spacing: 8,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <Web3ContextProvider>
          <SolnSquareVerifierProvider>
            <div className="App">
              <Home />
            </div>
          </SolnSquareVerifierProvider>
        </Web3ContextProvider>
      </SCThemeProvider>
    </ThemeProvider>
  );
}

export default App;

const Home: React.FC = () => {
  const {contract} = useSolnSquareVerifierContext();
  const {account} = useWeb3Context();
  const [tokenId, setTokenId] = useState('');

  const mint = async () => {
    try {
      const result = await contract?.mint(account, parseInt(tokenId, 10), {
        from: account,
      });
      console.log({result});
    } catch (error) {
      console.log({error});
    }
  };

  if (contract === undefined) {
    return null;
  }

  return (
    <Box width={480} margin="0 auto">
      <BoxTile my={1}>
        <TextField
          fullWidth
          label="Token ID"
          value={tokenId}
          onChange={(event) => {
            setTokenId(event.target.value);
          }}
          size="small"
        />
        <Box my={3} />
        <Button variant="contained" disableElevation color="primary" onClick={mint}>
          Mint Token
        </Button>
      </BoxTile>
    </Box>
  );
};
