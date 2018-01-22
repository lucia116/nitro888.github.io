pragma solidity ^0.4.19;

import "./casino.sol";

contract highLow is casino {
    function getShoeDeckCount() internal returns (uint8) {
        return 6;
    }
    function getBankerChangeCount() internal returns (uint8) {
        return 4;
    }
    function gameBet(uint _seed) internal returns(bool) {
        uint8 card  = drawCardsFromShoe(1,getSeed(_seed))[0];
        openCards   = uint64(card);
        uint8 temp  = cards.getCardPoint(card);
        if((temp==1)||(temp==13))
                return false;
        return true;
    }

	function gameRoundEnd(uint _seed) internal {
	    uint8 card      = drawCardsFromShoe(1,_seed)[0];
	    uint8 first     = cards.getCardPoint(uint8(openCards&255));
        uint8 second    = cards.getCardPoint(card);
	    openCards       |=uint64(card)<<32;

        if(second==first) {
            gameResult(2,0,true);
        } else if(first>=10) {
            if(second<first)    gameResult(1,110,false);
            else if(first==10)  gameResult(0,350,false);
            else if(first==11)  gameResult(0,530,false);
            else                gameResult(0,1070,false);
        } else if(first<=4) {
            if(second>first)    gameResult(0,110,false);
            else if(first==4)   gameResult(1,350,false);
            else if(first==3)   gameResult(1,530,false);
            else                gameResult(1,1070,false);
        } else if(first==9) {
            if(second>first)    gameResult(0,260,false);
            else                gameResult(1,130,false);
        } else if(first==5) {
            if(second>first)    gameResult(0,130,false);
            else                gameResult(1,260,false);
        } else if(first==8) {
            if(second>first)    gameResult(0,210,false);
            else                gameResult(1,150,false);
        } else if(first==6) {
            if(second>first)    gameResult(0,150,false);
            else                gameResult(1,210,false);
        } else if(first==7) {
            gameResult(second>first?0:1,170,false);
        }
	}
}