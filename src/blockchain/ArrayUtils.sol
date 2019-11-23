pragma solidity >=0.4.22 < 0.6.0;

// REFERENCE TO github.com/gatherheart
// support for only uint256 and address array 

library ArrayUtils{
    
    using ArrayUtils for uint256 [];
    using ArrayUtils for address [];
    
    function pop(uint256 [] storage array, uint256 idx) internal returns(uint256){
        uint256 ret = array[idx];
        array.removeItem(idx);
        return ret;
    }
    
    function removeAll(uint256 [] storage array) internal {
            
        for (uint256 i = 0; i < array.length - 1; i++){
            delete array[i];
        }
        
        delete array[array.length - 1];
        array.length = 0;
        
    }
    
    function removeAll(address [] storage array) internal {
            
        for (uint256 i = 0; i < array.length - 1; i++){
            delete array[i];
        }
        
        delete array[array.length - 1];
        array.length = 0;
        
    }
    
    function remove(uint256 [] storage array, uint256 index) internal {
            
        if(index >= array.length)
            return;
    
        for (uint256 i = index; i < array.length - 1; i++){
            array[i] = array[i + 1];
        }
        
        delete array[array.length - 1];
        array.length--;
        
    }
    
    function remove(address [] storage array, uint256 index) internal {
            
        if(index >= array.length)
            return;
    
        for (uint256 i = index; i < array.length - 1; i++){
            array[i] = array[i + 1];
        }
        
        delete array[array.length - 1];
        array.length--;
        
    }
    
    function count(uint256 [] memory array, uint256 item) internal pure returns(uint256){
        
        if(!array.exist(item))
            return 0;
        
        uint256 countNum = 0;
        
        for(uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                countNum++;
        }
        return countNum; 
    }  
    
    function count(address [] storage array, address item) internal view returns(uint256){
        
        if(!array.exist(item))
            return 0;
        
        uint256 countNum = 0;
        
        for(uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                countNum++;
        }
        return countNum; 
    }  
    
    function removeItem(uint256 [] storage array, uint256 item) internal{
        
        if(!array.exist(item))
            return;
            
        for (uint256 i = array.indexOf(item); i < array.length - 1; i++){
            array[i] = array[i + 1];
        }
        
        delete array[array.length - 1];
        array.length--;

    }
    
    function removeItem(address [] storage array, address item) internal{
        
        if(!array.exist(item))
            return;
            
        for (uint256 i = array.indexOf(item); i < array.length - 1; i++){
            array[i] = array[i + 1];
        }
        
        delete array[array.length - 1];
        array.length--;

    }
    
    
    function indexOf(uint256 [] memory array, uint256 item) internal pure returns(uint256){
        
        require(array.exist(item));
        
        for (uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                return i;
        }
    }
    
    function indexOf(address [] storage array, address item) internal view returns(uint256){
        
        require(array.exist(item));
        
        for (uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                return i;
        }
    }
    
    function exist(uint256 [] memory array, uint256 item) internal pure returns(bool) {
        
        for (uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                return true;
        }
        
        return false;
    }
    
    function exist(address [] storage array, address item) internal view returns(bool) {
        
        for (uint256 i = 0; i < array.length; i++){
            if(array[i] == item)
                return true;
        }
        
        return false;
    }
    
    function sort(uint256 [] storage array) internal{
        QuickSort(array, 0, array.length - 1);
    }
    
    function QuickSort(uint256 [] storage array, uint256 left, uint256 right) internal {
        
        uint256 i = left;
        uint256 j = right;
        
        // base
        if(i == j)
            return;
            
        uint256 pivot = array[ uint256(left + (right - left) / 2) ];
        
        while (i <= j) {
            
            while (array[i] < pivot) 
                i++;
            
            while (pivot < array[j]) 
                j--;
            
            if (i <= j) {
                (array[i], array[j]) = (array[j], array[i]);
                i++;
                j--;
            }
        }
        
        // branch 
        if (left < j)
            QuickSort(array, left, j);
        if (i < right)
            QuickSort(array, i, right);
    }
}