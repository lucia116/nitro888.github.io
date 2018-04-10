pragma solidity ^0.4.21;

import "./ownership.sol";

library cards{
	function getCardPoint(uint8 _card) internal pure returns(uint8) {
		return uint8((_card-1)%13)+1;
	}
	function shoe(uint _repeat, address _a, address _b, uint _c) internal pure returns (uint8[]) {
		uint8[] memory card	= new uint8[](52*_repeat);
		for(uint i = 0 ; i < card.length ; i++)
			card[i] = uint8(i%52+1);
		return shuffle(card,_a,_b,_c);
	}
	function shuffle(uint8[] _cards, address _a, address _b, uint _c) internal pure returns (uint8[]) {
		uint[][] memory rnds	= new uint[][](_cards.length/256+1);

		for(uint i = 0 ; i < rnds.length ; i++)
			rnds[i] = utils.rnd(_cards.length,_a,_b,(i==0?_c:rnds[i-1][0]));

		for(i = 0 ; i < _cards.length ; i++) {
			uint index		= rnds[i/256][i%256];
			uint8 temp		= _cards[i];
			_cards[i]		= _cards[index];
			_cards[index]	= temp;
		}

        return _cards;
	}
	function validateSlot(uint8[] _slots, uint8 _indexMax) internal pure returns (bool) {
	    for(uint i=0;i<_slots.length;i++)
	        if(_slots[i]>=_indexMax)
                return false;
	    return true;
	}
}

contract casino is ownership {
    uint[2]						            round;              // shoe-game
    uint64[]						        history;			// [records]

    uint8[]						            shoe;				// [cards]
	uint64 public						    openCards;			// 3*8 + 3*8 + 8

	mapping(address=>uint8[]) internal      userSlots;
	mapping(uint8=>address[])               slots;

    function getBetPrice() public constant returns (uint);
    function getSlotMax() public constant returns (uint8);
    function getShoeDeckCount() public constant returns (uint);

	function information(address player) public constant returns (uint[2],STATE,uint64[],uint64,uint8[]){
		return (round,state,history,openCards,userSlots[player]);
	}
	function cost() public constant returns (uint,uint,uint,uint) {
	    return (address(this).balance,getBetPrice(),getFee(),pendings.length);
	}
    function terminate() onlyOwner public {
        state       = STATE.DISABLE;
        uint8 max   = getSlotMax();
        
        uint totalTransfer  = 0;
		for(uint8 i=0 ; i<max ; i++)
		    for(uint j=0 ; j < slots[i].length ; j++ )
		        totalTransfer   +=transfer(pending(slots[i][j], getBetPrice()), address(this).balance-totalTransfer);
		        
        reset();

        if(pendings.length==0)
            msg.sender.transfer(address(this).balance);
    }
	function reset() private {
	    uint8 max   = getSlotMax();
        for(uint8 i = 0 ; i < max ; i++) {
			for(uint j = 0 ; j < slots[i].length ; j++)
				delete userSlots[slots[i][j]];
			slots[i].length = 0;
		}
	}

	function resetShoe(address _a, address _b, uint _c, bool _d) private {
        openCards   = 0;
	    			
        if(shoe.length > 30) {
            if(_d)
                round[1]++;
        } else {
            round[0]++;
            round[1]        = 1;
    		history.length  = 0;
    		shoe            = cards.shoe(getShoeDeckCount(), _a, _b, _c); // 6set of decks
    		drawCardsFromShoe(9,_c|uint(shoe[0])<<64|(uint(shoe[1])<<128)|(uint(shoe[2])<<192)|(uint(shoe[3])<<248));// delete cards
        }
    }

    function drawCardsFromShoe(uint8 _count, uint _seed) internal returns(uint8[]) {
        shoe                    = cards.shuffle(shoe,block.coinbase,lastUser,_seed);
        uint8[] memory temp     = new uint8[](_count);
        
        for(uint i = 0 ; i < _count ; i++)
            temp[i] = shoe[shoe.length-1-i];
        shoe.length   -=_count;

        return temp;
    }

	function casino() public {
		state       = STATE.PLAY;
        round[0]   = 1;
	}

    event eventUpdate(uint[2],STATE,uint64[],uint64,uint,uint,uint,uint8[]);

	function update(uint _seed) onlyOwner public {
		if(state==STATE.READY) {
			state	    = STATE.OPEN;
			if(!gameBet(_seed)) {
			    state   = STATE.READY;
                resetShoe(block.coinbase,lastUser,_seed,false);
			}
		} else if(state==STATE.OPEN) {
			state	    = STATE.CLOSE;
			updatePending();
		} else if(state==STATE.CLOSE) {
			state       = STATE.PLAY;
    		gameRoundEnd(_seed);
		} else if(state==STATE.PLAY) {
			state       = STATE.READY;
			resetShoe(block.coinbase,lastUser,_seed,true);
		}
		emit eventUpdate(round,state,history,openCards,getBetPrice(),getFee(),pendings.length,userSlots[msg.sender]);
	}
	
    function gameBet(uint _seed) internal returns (bool);
    function gameRoundEnd(uint _seed) internal;

    function getSeed(uint _seed) internal constant returns (uint) {
        return  block.number|(_seed|(history.length>0?uint(history[history.length-1])<<128:block.number));
    }

	function gameResult(uint8 _win, uint _rate, bool _pushBack) internal {
	    uint betPrice           = getBetPrice();
	    uint fee                = getFee();
	    uint totalTransfer	    = 0;
	    
	    uint8 max               = getSlotMax();
		for(uint8 i = 0 ; i < max ; i++) {
		    for(uint j=0 ; j < slots[i].length ; j++ ) {
		        if(_pushBack)   totalTransfer   +=transfer(pending(slots[i][j], betPrice+fee), address(this).balance-totalTransfer);
		        else if(i==_win)totalTransfer   +=transfer(pending(slots[i][j], utils.percent(betPrice,_rate)), address(this).balance-totalTransfer);
    		}
		}

		reset();

		history.push(openCards);
	}

	function bet(uint8[] _slots) payable public{
	    require(state==STATE.OPEN&&_slots.length>0&&msg.value==getBetPrice()*_slots.length&&cards.validateSlot(_slots,getSlotMax()));

        for(uint8 i = 0 ; i < _slots.length ; i++)
		    slots[_slots[i]].push(msg.sender);
		lastUser	= msg.sender;
	}
}