pragma solidity >=0.4.22 <0.6.0;
import "./Ownerable.sol";
import "./SafeMath.sol";
import "./ArrayUtils.sol";
import "./Ownerable.sol";

contract Database {
    
    constructor () public {}
    mapping (uint256 => Transaction) public transactions;
    uint256 [] public openTxids;
    uint256 [] public closedTxids;
    
    struct Transaction {
        uint256 txid; // transaction id
        uint256 txTime; // the time of transaction date
        string txStatus;
        
        // seller's information
        address seller; 
        string sellerAddress;  
        string sellerEmail;
        string sellerPhone;
        
        address validator;

        uint256 amount; // serial number of the CarCoin 
        string message;
        
        Validation [] reports; // the list of reports about seller's history
    }
    
    struct Validation {
        uint256 timeStamp; // report time    
        string nameOfPage; // reference page
        string nameofSite;
        uint256 accessTime; 
        string url; // reference url
    }
    
    
}