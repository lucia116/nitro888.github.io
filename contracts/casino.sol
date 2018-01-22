pragma solidity ^0.4.19;

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
			rnds[i] = utils.rng(_cards.length,_a,_b,(i==0?_c:rnds[i-1][0]));

		for(i = 0 ; i < _cards.length ; i++) {
			uint index		= rnds[i/256][i%256];
			uint8 temp		= _cards[i];
			_cards[i]		= _cards[index];
			_cards[index]	= temp;
		}

        return _cards;
	}
}

contract casino is ownership {
    uint[3]						        round;                                  // stage-round-game
    uint64[]						    history;							    // [records]

    // todo : change this, when it will be uploaded
    uint constant public                betPrice            = 1000000000000000; // 0.001E (1,000,000,000,000,000,000 = 1eth)
	int								    profit;

    uint8[]						        shoe;							        // [cards]
	uint64 public						openCards;						        // 3*8 + 3*8 + 8
    address[][3]					    slots;

    uint constant public				bankersWithdrawlFee	= 5;                // 5%
    uint constant public				bankerDepositWeight	= 1000;
    uint constant public				bankerMax			= 16;
    address[]						    bankers;
    address[]						    waitings;

	function information() public constant returns (uint[3],STATE,uint64[],uint64,uint,int,uint,uint,address[],uint,address[],uint){
		return ( round,state,history,openCards,betPrice,profit,transferFee,betPrice * bankerDepositWeight, bankers, bankerMax, waitings, pendingTransfer.length);
	}

    function terminate() onlyOwner public {
        uint totalTransfer  = 0;
        state               = STATE.DISABLE;

        totalTransfer   +=bankerRemove(utils.percent(betPrice * bankerDepositWeight, bankersWithdrawlFee));
        for(uint i = 0 ; i < waitings.length ; i++)
			totalTransfer+=transfer(waitings[i],betPrice * bankerDepositWeight,address(this).balance-totalTransfer,0);
        totalTransfer   +=updatePending();
        
		for(i = 0 ; i < slots.length ; i++) {
		    transfers(slots[i],betPrice,totalTransfer,true);
            slots[i].length	= 0;
		}

        if(pendingTransfer.length==0)
            msg.sender.transfer(address(this).balance-totalTransfer);
    }
	function bankerReserve() payable isTrue((state!=STATE.ROUNDEND)&&(betPrice*bankerDepositWeight==msg.value)) public {
		waitings.push(msg.sender);
	}
	function bankerRemove(uint _fee) private returns (uint){
		int share		    = bankers.length>0?(int(bankers.length * betPrice * bankerDepositWeight) + profit) / int(bankers.length) : 0;
	    uint totalTransfer	= 0;

        for(uint i = 0 ; i < bankers.length ; i++)
            if(share>0)
                totalTransfer+=transfer(bankers[i], uint(share), address(this).balance-totalTransfer, _fee);

        bankers.length = 0;
        return totalTransfer;
	}
	function bankerUpdate() private {
        bankerRemove(utils.percent(betPrice * bankerDepositWeight, bankersWithdrawlFee));

		for(uint i = 0 ; i < waitings.length ; i++)
			if(i<bankerMax) bankers.push(waitings[i]);
			else            waitings[i-bankerMax]	= waitings[i];
        waitings.length = waitings.length>bankerMax?waitings.length-bankerMax:0;
	}

	function resetShoe(address _a, address _b, uint _c, bool _d) private {
        openCards   = 0;
	    			
        if(shoe.length > 30) {
            if(_d)
                round[2]++;
            return;
        }

		if(round[1]==getBankerChangeCount()) {  // 9 set of shoes
		    round[0]++;
		    round[1] = 1;
            bankerUpdate();                     // banker change
		}
		else
		    round[1]++;
		round[2]     = 1;
		
		history.length= 0;
		// 6set of decks
		shoe          = cards.shoe(getShoeDeckCount(), _a, _b, _c);
		// delete cards
		drawCardsFromShoe(9,_c|uint(shoe[0])<<64|(uint(shoe[1])<<128)|(uint(shoe[2])<<192)|(uint(shoe[3])<<248));
    }

	function casino() public {
	    lastUser    = msg.sender;
		state       = STATE.ROUNDEND;
        round[0]   = 1;
	}

	event eventUpdate(uint[3],STATE,uint64[],uint64);

	function update(uint _seed) onlyOwner public {
		if(state==STATE.READY) {
			state	    = STATE.BET;
			if(!gameBet(_seed)) {
			    state   = STATE.READY;
                resetShoe(block.coinbase,lastUser,_seed,false);
			}
		} else if(state==STATE.BET) {
			state	    = STATE.BETEND;
			updatePending();
		} else if(state==STATE.BETEND) {
			state       = STATE.ROUNDEND;
    		gameRoundEnd(_seed);
		} else if(state==STATE.ROUNDEND) {
			state       = STATE.READY;
			resetShoe(block.coinbase,lastUser,_seed,true);
		}
		eventUpdate(round,state,history,openCards);
	}

    function gameBet(uint _seed) internal returns (bool);
    function gameRoundEnd(uint _seed) internal;
    function getShoeDeckCount() internal returns (uint8);
    function getBankerChangeCount() internal returns (uint8);

    function getSeed(uint _seed) internal constant returns (uint) {
        return  block.number|(_seed|(history.length>0?uint(history[history.length-1])<<128:block.number));
    }
    function drawCardsFromShoe(uint8 _count, uint _seed) internal returns(uint8[]) {
        shoe                    = cards.shuffle(shoe,block.coinbase,lastUser,_seed);
        uint8[] memory temp     = new uint8[](_count);
        
        for(uint i = 0 ; i < _count ; i++)
            temp[i] = shoe[shoe.length-1-i];
        shoe.length   -=_count;

        return temp;
    }

	function gameResult(uint8 _win, uint _rate, bool _pushBack) internal {
		for(uint i = 0 ; i < slots.length ; i++) {
		    if(_pushBack)
		        transfers(slots[i],betPrice,0,false);
		    else if(i==_win)
		        transfers(slots[i],utils.percent(betPrice,_rate),0,false);
            else
                profit  +=int(betPrice*slots[i].length);
            slots[i].length	= 0;
		}
		history.push(openCards);
	}
	function transfers(address[] _users,uint _prize, uint _totalTransfer, bool _terminate) private {
        profit		-= int(_terminate?0:_prize*_users.length);
		for(uint i = 0 ; i < _users.length ; i++)
		    _totalTransfer+=transfer(_users[i], _prize, address(this).balance-_totalTransfer, transferFee);
	}

	function bet(uint8 _slot,uint8 _multi) payable isTrue(state==STATE.BET&&_multi>0&&msg.value==betPrice*_multi&&_slot<3) public returns (address[]){
        for(uint8 i = 0 ; i < _multi ; i++)
		    slots[_slot].push(msg.sender);
		lastUser	= msg.sender;
		return slots[_slot];
	}
}