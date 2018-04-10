pragma solidity ^0.4.21;

import "./lotto.sol";

contract lotto953 is lotto {
    uint constant public        fee                 = 100000000000000;  // fee for transfer - 0.0001E (1,000,000,000,000,000,000 = 1eth)
    uint constant public        ticketPrice         = 2000000000000000; // 0.002E (1,000,000,000,000,000,000 = 1eth)
    
	uint8 constant public       ballCount	        = 9;    // must be under 64
	uint8 constant public       matchCount	        = 5;    // match 5 & bonus 1

	uint constant public        percentMaintenance  = 5;    // 20%
	uint constant public        percent1stPrize     = 25;   // 25%
	uint constant public        percent2ndPrize     = 20;   // 20%

    function getFee() public constant returns (uint) {
        return fee;
    }
	function getTicketPrice() public constant returns (uint) {
	    return ticketPrice;
	}
	function getBallCount() public constant returns (uint8) {
	    return ballCount;
	}
	function getMatchCount() public constant returns (uint8) {
	    return matchCount;
	}

	function roundEnd(uint _seed) internal {
	    uint64[] memory	balls	    = machine.balls(ballCount);
		uint64		    prizeNumbers= 0;
		uint64		    bonusNumber = 0;
        (prizeNumbers,bonusNumber)  = machine.lotto(ballCount,matchCount,block.coinbase,lastUser,_seed|(history.length>0?history[history.length-1]>>128:ballCount));
        
        bool result = true;
        result = result && prize1(prizeNumbers, utils.percent(address(this).balance, percent1stPrize));                    // 1st	- match all numbers
        result = result && prize2(prizeNumbers, utils.percent(address(this).balance, percent2ndPrize), bonusNumber, balls);// 2nd	- match all-1 numbers + 1 bonus number;

        if(result&&(address(this).balance>1000000000000000000))
		    owner.transfer(utils.percent(address(this).balance, percentMaintenance));

        updateHistory(prizeNumbers,bonusNumber);
	}
}