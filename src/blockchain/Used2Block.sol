pragma solidity >=0.4.22 <0.6.0;

import "./ERC20.sol";
import "./Ownerable.sol";
import "./ArrayUtils.sol";
import "./StringUtils.sol";
import "./Transaction.sol";

contract Used2Block is Ownerable {
    
    using SafeMath for uint256;
    using ArrayUtils for uint256 [];
    using ArrayUtils for address [];
    using StringUtils for string;
    mapping (string => uint256 []) fraudHistoryPhone;
    mapping (address => uint256 []) fraudHistoryAddress;
    mapping (string => uint256 []) fraudHistoryEmail;
    
    // transaction Pool
    address [] public openTxids;
    ERC20 Bank;
    constructor (address bank) public {
        Bank = ERC20(bank);
    }
    
    function getTxLen() public view returns (uint256){
        return openTxids.length;
    }
    
    function getOpenTx(uint256 idx) public view returns(address, string memory){
        require(idx < openTxids.length);
        address tmpAddr;
        string memory tmp;
        
        Transaction t = Transaction(openTxids[idx]);
        (tmpAddr, tmp) = t.getInfo();
        return (tmpAddr, tmp);
    }
    
    // return types
    // (string => uint256 []) fraudHistoryPhone;
    // (address => uint256 []) fraudHistoryAddress;
    // (string => uint256 []) fraudHistoryEmail;
    function findFraudWithPhone(string memory phone) public view returns (uint256 [] memory){
        return fraudHistoryPhone[phone];
    }
    
    function findFraudWithAddres(address seller) public view returns (uint256 [] memory){
        return fraudHistoryAddress[seller];
    }
    
    function findFraudWithEmail(string memory email) public view returns (uint256 [] memory){
        return fraudHistoryEmail[email];
    }
    
    function getValidation(address txid) public view returns (string memory){
        return Transaction(txid).getValidation();    
    }
    
    function makeTx(address seller, string memory sellerEmail, string memory sellerPhone, 
                uint256 amount, string memory message, uint256 fee, uint256 PoS) public {
        
        // seller should not be same with buyer
        require(msg.sender != seller);
        // amount_ * 1.05 = amount + fee
        require(fee >= 0 && amount > 0 && Bank.balanceOf(msg.sender) >= (amount + fee));
        
        Transaction tx_ = new Transaction(msg.sender, seller, sellerEmail, sellerPhone, amount, message, address(Bank), fee, PoS);
        openTxids.push(address(tx_));
        
    }
    
    function validate(address txid, string memory nameOfPage, string memory nameofSite, uint256 accessTime, string memory url) public {
        address seller = Transaction(txid).getSeller();
        // sender should not be validator
        require(seller != msg.sender);
        Transaction(txid).validate(nameOfPage, nameofSite, accessTime, url);
        Transaction(txid).setStatus(1);
    }
    
    function terminateTx(address txid) public{
        address buyer = Transaction(txid).getBuyer();
        address seller = Transaction(txid).getSeller();
        address validator = Transaction(txid).getValidator();
        uint256 amount = Transaction(txid).getAmount();
        uint256 fee = Transaction(txid).getFee();
        
        // msg sender should be buyer 
        require(buyer == msg.sender && Bank.balanceOf(buyer) > (amount + fee));
        
        Bank.transfer(seller, amount);
        Bank.transfer(validator, amount);
        openTxids.removeItem(txid);
        Transaction(txid).setStatus(2);
    }
    
}
