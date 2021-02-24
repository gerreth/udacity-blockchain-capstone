pragma solidity >=0.4.21 <0.6.0;

import "./UdacityCapstoneERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your UdacityCapstoneERC721Mintable class
contract SolnSquareVerifier is UdacityCapstoneERC721Mintable {
    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address account, bytes32 key);

    Verifier verifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 key;
        address account;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) public UdacityCapstoneERC721Mintable(name, symbol, baseTokenURI) {
        verifier = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        //  verify solution
        require(verifier.verifyTx(a, b, c, input), "Solution is not correct");

        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

        //  - make sure the solution is unique (has not been used before)
        require(
            uniqueSolutions[key].account == address(0),
            "Solution is not unique."
        );

        address account = msg.sender;

        Solution memory solution = Solution({key: key, account: account});
        solutions.push(solution);
        uniqueSolutions[key] = solution;

        emit SolutionAdded(account, key);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        address account,
        uint256 tokenId,
        bytes32 key
    ) public {
        require(uniqueSolutions[key].key == key, "Solution does not exist");
        require(
            uniqueSolutions[key].account == msg.sender,
            "Solution does not belong to user"
        );
        //  - make sure you handle metadata as well as tokenSuplly
        super.mint(account, tokenId);
    }
}
