pragma solidity ^0.4.21;

import "./casino.sol";

contract dragonTiger is casino {
    uint constant public        fee                 = 100000000000000;  // fee for transfer - 0.0001E (1,000,000,000,000,000,000 = 1eth)
    uint constant public        betPrice            = 1000000000000000; // 0.001E (1,000,000,000,000,000,000 = 1eth)
    
    function getFee() public constant returns (uint) {
        return fee;
    }
    function getBetPrice() public constant returns (uint) {
        return betPrice;
    }
    function getSlotMax() public constant returns (uint8) {
        return 3;
    }
    function getShoeDeckCount() public constant returns (uint) {
        return 6;
    }
    
    function gameBet(uint _seed) internal returns(bool) {
        return true;
    }

	function gameRoundEnd(uint _seed) internal {
	    uint8[] memory draws= drawCardsFromShoe(2,getSeed(_seed));

		uint8 dragon	    = cards.getCardPoint(draws[0]);
		uint8 tiger         = cards.getCardPoint(draws[1]);
		openCards           = (uint64(draws[1])<<32) | uint64(draws[0]);

		if (dragon>tiger)		gameResult(0,200,false);  // dragon   200%
		else if (dragon<tiger)	gameResult(1,200,false);  // tiger    200%
		else					gameResult(2,900,false);  // tie      900%
	}
}