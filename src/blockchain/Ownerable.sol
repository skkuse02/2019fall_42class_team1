pragma solidity >=0.4.22 < 0.6.0;

contract Ownerable {
    // event
    event OwnerLog(address);
    address public owner;
    
    constructor() public{
        owner = msg.sender;
        emit OwnerLog(msg.sender);
    }
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    
    modifier NotZeroAddr(address addr){
        require(addr != address(0));
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner NotZeroAddr(newOwner) {
        if(owner != newOwner)
            owner = newOwner;
    }   
}