pragma solidity >=0.4.22 <0.6.0;

// Reference to https://github.com/OpenZeppelin/openzeppelin-solidity

library SafeMath {
    
    function incr(uint256 a) internal pure returns(uint256){
        return add(a, 1);
    } 
    
    function decr(uint256 a) internal pure returns(uint256){
        return sub(a, 1);
    }
    
    function mul(uint256 a, uint256 b) internal pure returns(uint256){
        
        if (a == 0 || b == 0)
            return 0;
            
        uint256 result = a * b;
    
        require(result / b == a, "SafeMath: overflow");
        return result;
    }
    
    function add(uint256 a, uint256 b) internal pure returns(uint256){
        
        uint256 result = a + b;
        
        require(result >= a && result >= b, "SafeMath: overflow");
        return result;
        
    }
    
    function sub(uint256 a, uint256 b) internal pure returns(uint256){
        
        uint256 result = a - b;
        
        require(result <= a, "SafeMath: underflow");
        return result;
    }
    
    function div(uint256 a, uint256 b) internal pure returns(uint256){
        
        require(b != 0, "Exception: Division by zero");
        
        uint256 result = a / b;
        
        return result;
    }
    
    function mod(uint256 a, uint256 b) internal pure returns(uint256){
        
        require(b != 0, "Exception: modulo by zero");
        
        uint256 result = a % b;
        return result;
    }
    
}