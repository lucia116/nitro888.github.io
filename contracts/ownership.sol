pragma solidity ^0.4.21;

library utils{
	function rnd(uint _max, address _a, address _b, uint _c) internal pure returns (uint[]) {
	    // 0~_max-1
	    uint[] memory	r = new uint[](256);
	    uint			seed= uint(keccak256(_c,_a,_b)); 
	    for(uint i = 0 ; i < r.length ; i++) {
	        r[i]	= seed%_max;
            seed    = seed&1==1?(seed>>1)|2**255:seed>>1;
	    }
        return r;
	}
	function percent(uint _value, uint _percent) internal pure returns (uint) {
	    return _value * _percent / 100 ;
	}
}

contract ownership {
    struct pending  {
        address     player;
        uint    	value;
    }

	enum STATE              { READY, OPEN, CLOSE, PLAY, DISABLE }
	
	pending[]               pendings;

	address public          owner;
    address	internal		lastUser;   // for rnd seed
    STATE public	        state;

	function ownership() public { owner = msg.sender; lastUser = this;}
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function terminate() onlyOwner public;
    function getFee() public constant returns (uint);

    function withdrawal(uint _value) onlyOwner payable public {
        require(_value<=address(this).balance);
        owner.transfer(_value);
    }
    
    function transfer(pending _pending, uint _lessThen) internal returns (uint) {
        if(_pending.value<=_lessThen) {
            uint value  = _pending.value;
            uint fee    = getFee();
            value       = value>fee ? value-fee : value;
            _pending.player.transfer(value);
            return value;
        }
        pendings.push(_pending);
        return 0;
    }
    
	function updatePending() internal {
	    uint totalTransfer = 0;
	    for(int i = int(pendings.length)-1 ; i >=0 ; i--) {
            uint value  = pendings[uint(i)].value;
            uint fee    = getFee();
            value       = value>fee ? value-fee : value;
	        if((value+totalTransfer)<=address(this).balance) {
	            address temp = pendings[uint(i)].player;
	            pendings.length--;
	            totalTransfer+=value;
	            temp.transfer(value);
	        }
	        else
	            return;
	    }
	}
}