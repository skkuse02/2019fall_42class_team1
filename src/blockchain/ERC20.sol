pragma solidity >=0.4.22 <0.6.0;
import "./IERC20.sol";
import "./SafeMath.sol";

contract ERC20 is IERC20{
    
    using SafeMath for uint256;
    
    string public name = "Used2BlockCoin";
    string public symbol = "UBC";
    uint8 public decimals = 18;
    
    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowed;
    uint256 private _totalSupply;
    
    // Address Should not be Zero
    modifier NotZeroAddr(address addr){
        require(addr != address(0)); 
        _;
    }
    
    constructor () public{
        _totalSupply = 10**18;
        balances[tx.origin] = _totalSupply;
    }
    
    function totalSupply() external view returns (uint256){
        return _totalSupply;    
    }
    
    function balanceOf(address who) external view NotZeroAddr(who) returns (uint256){
        return balances[who];
    }
    
    function allowance(address owner, address spender) external view NotZeroAddr(spender) returns (uint256){
        return allowed[owner][spender];
    }
    
    function transfer(address to, uint256 value) external NotZeroAddr(to) returns (bool){
        // Underflow And overflow check 
        require(
            balances[tx.origin] >= value
            && balances[to] + value > balances[to]
        );
        
        _transfer(tx.origin, to, value);
        
        return true;
    }
    
    function _transfer(address _from, address to, uint256 value) private{
        
        balances[_from].sub(value);
        balances[to].add(value);
        emit Transfer(_from, to, value);
        
    }
    
    function approve(address spender, uint256 value) external NotZeroAddr(spender) returns (bool) {
        
        allowed[tx.origin][spender] = value;
        emit Approval(tx.origin, spender, value);
        
        return true;
        
    }
    
    // fund holder: addresss _from, 
    // sender who is approved from fund holder : msg.sender
    // receiver : address to
    function transferFrom(address _from, address to, uint256 value) external NotZeroAddr(_from) NotZeroAddr(to) returns (bool){
        
        require(allowed[_from][tx.origin] >= value);
        
        _transfer(_from, to, value);
        allowed[_from][tx.origin] -= value;
        
        return true;
    }
    
    
}