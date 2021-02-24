const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', (accounts) => {
  const owner = accounts[0];
  const account = accounts[1];

  describe('match erc721 spec', function () {
    // hash for the solution
    const hash = '0xc55aebbf4232aeee574fa5bec46980f81f7853f6362963d27c1abe6b372d09d8';

    beforeEach(async function () {
      this.contract = await SolnSquareVerifier.deployed();
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('can add a new solution', async function () {
      const result = await this.contract.addSolution(
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
      );

      assert.equal(result.logs[0].event, 'SolutionAdded', 'Solution was not added');
    });
    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('can mint a token', async function () {
      await this.contract.mint(account, 1234, hash);

      const uri = await this.contract.tokenURI.call(1234);

      assert.equal(uri, 'BaseTokenURI1234', 'Token was not minted');
    });
  });
});
