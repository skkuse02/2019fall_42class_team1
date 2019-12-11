pragma solidity >=0.4.22 <0.6.0;
import "./ERC20.sol";
import "./Ownerable.sol";
import "./ArrayUtils.sol";
import "./Transaction.sol";

contract Used2Block is Ownerable {

    using ArrayUtils for uint256 [];
    using ArrayUtils for address [];
    mapping (string => address []) fraudHistoryPhone;
    mapping (address => address []) fraudHistoryAddress;
    mapping (string => address []) fraudHistoryEmail;
    mapping(string => address) transactions;

    // transaction Pool
    address [] public openTxids;

    // Bank Smart Contract
    ERC20 Bank;
    constructor (address bank) public {
        Bank = ERC20(bank);
    }

    function getTxLen() public view returns (uint256){
        return openTxids.length;
    }

    function getBalance(address id) public view returns(uint256){
        return Bank.balanceOf(id);
    }

    // return types
    // address Transcation address
    // uint8 status
    // address Seller address
    // String Seller's information
    function getOpenTx(uint256 idx) public view returns(address, uint8, address, string memory){
        require(idx < openTxids.length);
        address seller;
        string memory tmp;

        Transaction t = Transaction(openTxids[idx]);
        (seller, tmp) = t.getInfo();
        return (openTxids[idx], t.getStatus(), seller, tmp);
    }

    // return types
    // (string => uint256 []) fraudHistoryPhone;
    // (address => uint256 []) fraudHistoryAddress;
    // (string => uint256 []) fraudHistoryEmail;
    function findFraudWithPhone(string memory phone) public view returns (address [] memory){
        return fraudHistoryPhone[phone];
    }

    function findFraudWithAddres(address seller) public view returns (address [] memory){
        return fraudHistoryAddress[seller];
    }

    function findFraudWithEmail(string memory email) public view returns (address [] memory){
        return fraudHistoryEmail[email];
    }

    function getValidation(address txid) public view returns (string memory){
        return Transaction(txid).getValidation();
    }

    // 0 == waiting | 1 == Validated | 2 == terminated | 3 == completed
    function getStatus(address txid) public view returns (uint8){
        return Transaction(txid).getStatus();
    }

    function getTxAddress(string memory orderId) public view returns (address){
        return transactions[orderId];
    }

    function getOrderId(address txid) public view returns (string memory){
        return Transaction(txid).getOrderId();
    }

    function makeTx(string memory orderId, address seller, string memory sellerEmail, string memory sellerPhone,
                uint256 amount, string memory message, uint256 fee, uint256 PoS) public {

        // seller should not be same with buyer
        require(msg.sender != seller);
        // amount_ * 1.05 = amount + fee
        require(fee >= 0 && amount > 0 && Bank.balanceOf(msg.sender) >= (amount + fee));

        Transaction tx_ = new Transaction(orderId, msg.sender, seller, sellerEmail, sellerPhone, amount, message, address(Bank), fee, PoS);
        openTxids.push(address(tx_));
        transactions[orderId] = address(tx_);

    }

    function validate(address txid, string memory nameOfPage, string memory nameofSite, uint256 accessTime, string memory url) public {
        address seller = Transaction(txid).getSeller();
        // sender should not be validator and transaction is not validated
        require(seller != msg.sender && Transaction(txid).getStatus() < 1);
        Transaction(txid).validate(nameOfPage, nameofSite, accessTime, url);
        Transaction(txid).setStatus(1);
    }

    // Complete  transaction
    function completeTx(address txid) public{
        address buyer = Transaction(txid).getBuyer();
        address seller = Transaction(txid).getSeller();
        address validator = Transaction(txid).getValidator();
        uint256 amount = Transaction(txid).getAmount();
        uint256 fee = Transaction(txid).getFee();

        // msg sender should be buyer
        require(buyer == msg.sender && Bank.balanceOf(buyer) > (amount + fee) && Transaction(txid).getStatus() < 2);

        Bank.transfer(seller, amount);
        if (validator != address(0))
            Bank.transfer(validator, fee);
        openTxids.removeItem(txid);
        Transaction(txid).setStatus(3);
    }

    // Terminate fraud transaction and report fraud
    function reportTx(address txid) public {
        address buyer = Transaction(txid).getBuyer();
        address seller = Transaction(txid).getSeller();
        address validator = Transaction(txid).getValidator();
        uint256 amount = Transaction(txid).getAmount();
        uint256 fee = Transaction(txid).getFee();

        // msg sender should be buyer
        require(buyer == msg.sender && Bank.balanceOf(buyer) > fee && Transaction(txid).getStatus() == 1);

        fraudHistoryPhone[Transaction(txid).getSellerPhone()].push(txid);
        fraudHistoryAddress[seller].push(txid);
        fraudHistoryEmail[Transaction(txid).getSellerEmail()].push(txid);

        openTxids.removeItem(txid);
        Bank.transfer(validator, amount);
        Transaction(txid).setStatus(2);

    }

    function revertValidation(address txid) public {
        address buyer = Transaction(txid).getBuyer();
        require(buyer == msg.sender && Transaction(txid).getStatus() == 1);
        Transaction(txid).setZero();
        Transaction(txid).setStatus(0);
    }

}
