pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract Test {
    
    Test2 [] public t2;
    address buyer;
    
    function tmp() view public returns(uint256){
        return now;
    }
    
    function tmp2() public {
       t2.push(new Test2());
    }
    function tmp3() public view returns(address){
        return address(t2[0]);
    }
    function tmp4() public view returns(bool){
        return t2[0].tmp();
    }
    function tmp5() public {
        buyer = msg.sender;
    }
    function tmp6() public view returns(address){
        return buyer;
    }
    function tmp7() public view returns(string [] memory){
        return ("HelloWorld", "Test", "Works");
    }
    
}

contract Test2 {
    
    function tmp() pure public returns(bool){
        return true;
    }
    
}