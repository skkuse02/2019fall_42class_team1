pragma solidity >=0.4.22 < 0.6.0;

// REFERENCE TO github.com/gatherheart

library StringUtils{
    
    using StringUtils for string;
    
    function length(string calldata str) external pure returns (uint256){
        return bytes(str).length;
    }
    
    function strcmp(string calldata left, string calldata right) external pure returns (int8){
        bytes memory leftTmp = bytes(left);
        bytes memory rightTmp = bytes(right);
        uint256 leftLen = left.length();
        uint256 rightLen = right.length();
        
        uint256 limit = leftLen;
        
        // check smaller string length for for statmement
        if(leftLen > rightLen)
            limit = rightLen;
        
        
        for(uint256 i = 0; i < limit; i++){
            if(leftTmp[i] < rightTmp[i])
                return -1;
            else if(leftTmp[i] > rightTmp[i])
                return 1;
        }
        
        
        if(leftLen == rightLen)
            return 0;
        else if(leftLen < rightLen)
            return -1;
        else
            return 1;
            
    }

    
}
