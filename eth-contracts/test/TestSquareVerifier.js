const Verifier = artifacts.require('Verifier');

const proof = require('../../zokrates/code/square/proof.json');

contract('TestVerifier', (accounts) => {
  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await Verifier.deployed();
    });

    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it('can add a new solution', async function () {
      const result = await this.contract.verifyTx(
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
      );

      assert.equal(result.logs[0].event, 'Verified', 'Solution was verified');
    });

    // Test verification with incorrect proof
    it('can reject a wrong proof', async function () {
      // note, c and a are changed
      const result = await this.contract.verifyTx(
        proof.proof.c,
        proof.proof.b,
        proof.proof.a,
        proof.inputs,
      );

      assert.equal(result.logs[0], undefined, 'Solution was not verified');
    });
  });
});
