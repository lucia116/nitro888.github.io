pragma solidity ^0.4.19;

import "./casino.sol";

contract dragonTiger is casino {
    function getShoeDeckCount() internal returns (uint8) {
        return 6;
    }
    function getBankerChangeCount() internal returns (uint8) {
        return 4;
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