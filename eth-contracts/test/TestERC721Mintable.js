var ERC721Mintable = artifacts.require('UdacityCapstoneERC721Mintable');
const truffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', (accounts) => {
  const owner = accounts[0];
  const account_two = accounts[1];
  const URI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new('Name', 'Symbol', URI, {from: owner});

      // TODO: mint multiple tokens
      await this.contract.mint(owner, 1, {from: owner});
      await this.contract.mint(owner, 2, {from: owner});
      await this.contract.mint(owner, 3, {from: owner});
      await this.contract.mint(account_two, 4, {from: owner});
      await this.contract.mint(account_two, 5, {from: owner});
    });

    it('should return total supply', async function () {
      const totalSupply = await this.contract.totalSupply.call();
      assert.equal(totalSupply.toNumber(), 5, 'Total supply delivered unexpected value');
    });

    it('should get token balance', async function () {
      const balance = await this.contract.balanceOf.call(owner);
      assert.equal(balance, 3, 'Incorrect balance for owner');
      const balance_account_two = await this.contract.balanceOf.call(account_two);
      assert.equal(balance_account_two, 2, 'Incorrect balance for account_two');
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      let uri = await this.contract.tokenURI.call(1);
      assert.equal(uri, `${URI}1`, 'Incorrect tokenURI for token ID');
    });

    it('should transfer token from one owner to another', async function () {
      await this.contract.transferFrom(owner, account_two, 1, {from: owner});
      const _owner = await this.contract.ownerOf.call(1);
      assert.equal(_owner, account_two, 'Wrong owner of token after transfer');
    });
  });

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new('Name', 'Symbol', 'URI', {from: owner});
    });

    it('should fail when minting when address is not contract owner', async function () {
      await truffleAssert.reverts(this.contract.mint(account_two, 99, {from: account_two}));
    });

    it('should return contract owner', async function () {
      const result = await this.contract.getOwner.call();
      assert.equal(owner, result, 'Owner is wrong');
    });
  });
});
