pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;
import "./Database.sol";
import "./ERC20.sol";
import "./Ownerable.sol";
import "./ArrayUtils.sol";

contract Used2Block is Ownerable, ERC20, Database {

    using SafeMath for uint256;
    using ArrayUtils for uint256 [];

    constructor () public {}

    function openTx() public view returns (uint256 [] memory) {
        return openTxids;
    }

    //mapping (string => uint256 []) fraudHistoryPhone;
    //mapping (address => uint256 []) fraudHistoryAddress;
    //mapping (string => uint256 []) fraudHistoryEmail;
    function findFraudWithPhone(string memory phone) public view returns (uint256 [] memory){
        return fraudHistoryPhone[phone];
    }

    function findFraudWithAddres(address seller) public view returns (uint256 [] memory){
        return fraudHistoryAddress[seller];
    }

    function findFraudWithEmail(string memory email) public view returns (uint256 [] memory){
        return fraudHistoryEmail[email];
    }

    function fraudHistory(uint256 txid) public view returns (Transaction memory){
        return txs[txid];
    }



}
