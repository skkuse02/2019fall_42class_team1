pragma solidity >=0.4.22 <0.6.0;

import "./ERC20.sol";
import "./StringUtils.sol";

contract Transaction {
    
    using StringUtils for string;

    ERC20 Bank;
    
    address public seller; // owner contract id
    address buyer;
    address public validator;
    
    address txid; // transaction id
    uint256 txTime; // the time of transaction date
    uint8 txStatus; // 0 start | 1 validatd | 2 End 
    uint256 public fee;
    uint256 public PoS;
    // seller's information
    string sellerEmail;
    string sellerPhone;
    
    uint256 public productId;
    uint256 public amount; // the price of product 
    string message;
    
    Validation public report; // the list of reports about seller's history
    
    struct Validation {
        uint256 timeStamp; // report time    
        string nameOfPage; // reference page
        string nameofSite;
        uint256 accessTime; 
        string url; // reference url
    }
    
    
    constructor (address buyer_, address seller_, string memory sellerEmail_, string memory sellerPhone_, 
                uint256 amount_, string memory message_, address bank_, uint256 fee_, uint256 PoS_) public {
        
        Bank = ERC20(bank_);
        
        buyer = buyer_;
        seller = seller_;
        sellerEmail = sellerEmail_;
        sellerPhone = sellerPhone_;
        txTime = now;
        message = message_;
        amount = amount_;
        PoS = PoS_;
        fee = fee_;
    }
    
    // Paramerters
    //  uint256 timeStamp; // report time    
    //  string nameOfPage; // reference page
    //  string nameofSite;
    //  uint256 accessTime; // Unix time Stamp
    //  string url; // reference url
    function validate(string memory nameOfPage, string memory nameofSite, uint256 accessTime, string memory url) public {
        
        // PoS applied here
        require(PoS >= amount && Bank.balanceOf(tx.origin) >= amount + PoS);
        
        Validation memory v;
        v.timeStamp = now;
        v.nameOfPage = nameOfPage;
        v.nameofSite = nameofSite;
        v.accessTime = accessTime;
        v.url = url;
        report = v;
        
        validator = tx.origin;
        
    }
    
    function getInfo() public view returns (address, string memory){
        string memory ret;
        string memory delim = "#";
        string memory tmp = 
                string(abi.encodePacked(uint2str(txTime), delim, sellerEmail, delim, sellerPhone, '\n\n'));
        
        ret = string(abi.encodePacked(ret, tmp));
        return (seller, ret);
    }
    
    function getBuyer() public view returns (address){
        return buyer;
    }
    
    function getSeller() public view returns (address){
        return seller;
    }
    
    function getValidator() public view returns (address){
        return validator;
    }
    
    function getAmount() public view returns (uint256){
        return amount;
    }
    
    function getFee() public view returns (uint256){
        return fee;
    }
    
    function setStatus(uint8 status) public {
        require(tx.origin == buyer);
        txStatus = status;
    }
    function getStatus() public view returns(uint8){
        return txStatus;
    }
    
    function getValidation() public view returns (string memory){
        
        string memory delim = "#";
        Validation memory v = report;
        string memory ret = string(abi.encodePacked(uint2str(v.timeStamp), delim, v.nameOfPage, delim, 
                            v.nameofSite, delim, uint2str(v.accessTime), delim, v.url, '\n\n'));
            
        return ret;
    }
    
    /*REFERENCE: loomnetwork/erc721x/blob/master/contracts/Core/ERC721X/ERC721XTokenNFT.sol*/
    function uint2str(uint256 _i) private pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }

        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }

        return string(bstr);
    }
    
}