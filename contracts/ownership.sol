pragma solidity ^0.4.19;

library utils{
	function rng(uint _max, address _a, address _b, uint _c) internal pure returns (uint[]) {
	    // 0~_max-1
	    uint[] memory	rnd = new uint[](256);
	    uint			seed= uint(keccak256(_c,_a,_b)); 
	    for(uint i = 0 ; i < rnd.length ; i++) {
	        rnd[i]	= seed%_max;
            seed    = seed&1==1?(seed>>1)|2**255:seed>>1;
	    }
        return rnd;
	}
	function percent(uint _value, uint _percent) internal pure returns (uint) {
	    return _value * _percent / 100 ;
	}
}

contract ownership {
    struct pending  {
        address     target;
        uint    	value;
        uint    	transferFee;
    }

	enum STATE              { READY, BET, BETEND, ROUNDEND, DISABLE }
	
	pending[]               pendingTransfer;
	uint constant public    transferFee             = 100000000000000;    // 0.0001E (1,000,000,000,000,000,000 = 1eth)

	address public          owner;
    address	internal		lastUser;
	uint                    ownerBalance            = 0;
    STATE public	        state;

	function ownership() public { owner = msg.sender; lastUser = this;}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier isTrue(bool value) {
        require(value);
        _;
    }

    function terminate() onlyOwner public;

    function withdrawal(uint _value) onlyOwner payable isTrue((_value<=address(this).balance) && (_value<=ownerBalance)) public {
        ownerBalance     -= _value;
        owner.transfer(_value);
    }
	function transfer(address _target, uint _value, uint _lessThen, uint _fee) internal returns (uint) {
	    uint totalTransfer = 0;
	    _value  = _value>_fee?_value-_fee:_value;
		if(_value<=_lessThen) {
		    ownerBalance+=_fee;
			totalTransfer+=_value;
			_target.transfer(_value);
		} else
			pendingTransfer.push(pending(_target,_value,_fee));
        return totalTransfer;
	}
	function updatePending() internal returns (uint) {
		uint totalTransfer = 0;
		for(int i = int(pendingTransfer.length)-1 ; i >=0 ; i--) {
			if(i>=0&&pendingTransfer[uint(i)].value+totalTransfer<=address(this).balance) {
				address target	= pendingTransfer[uint(i)].target;
				uint    value	= pendingTransfer[uint(i)].value;
				totalTransfer	+=value;
				ownerBalance    +=pendingTransfer[uint(i)].transferFee;
				pendingTransfer.length--;
				target.transfer(value);
			}
		}
		return totalTransfer;
	}
}