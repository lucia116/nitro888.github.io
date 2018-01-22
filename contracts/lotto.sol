pragma solidity ^0.4.19;

import "./ownership.sol";

library machine {
	function balls(uint8 _ballCount) internal pure returns (uint128[]) {
		uint128[] memory b	= new uint128[](_ballCount%128);
		for(uint i = 0 ; i < b.length ; i++)
			b[i] = uint128(1)<<i;
		return b;
	}
	function matchLotto(uint128 _marks, uint128[] _balls, uint _matchCount) internal pure returns (bool){
		uint count	= 0;
		for(uint i = 0 ; i <  _balls.length ; i++)
			if(_balls[i]&_marks>0)
				count++;
		return count==_matchCount;
	}
	function lotto(uint8 _ballCount, uint8 _drawCount, address _a, address _b, uint _c) internal pure returns (uint128,uint128) {
		uint128[] memory    b		= balls(_ballCount);
		uint[] memory       rnds    = utils.rng(_ballCount%128, _a, _b, _c);
		
		for(uint i = 0 ; i < rnds.length ; i++) {
			uint128 temp	        = b[i%(_ballCount%128)];
			b[i%(_ballCount%128)]   = b[rnds[i]];
			b[rnds[i]]              = temp;
		}

		for(i=1 ; i < _drawCount ; i++)
			b[0]	|=b[i];

		return (b[0],b[_drawCount]);	// prize, bonus
	}
    function validateLottoTicket(uint128[] _tickets, uint8 _ballCount, uint8 _matchCount) internal pure returns (bool) {
		uint128[] memory    b       = balls(_ballCount);
		bool                result	= true;
	
		for(uint i = 0 ; i <  _tickets.length ; i++) {
			uint count = 0;
			for(uint j = 0 ; j <  b.length ; j++)
				if(b[j]&_tickets[i]>0)
					count++;
			result	= result && (count != _matchCount);
		}
        
        return result&&_tickets.length>0;
    }
}

contract lotto is ownership {

    uint                                    round           = 1;
	uint				                    balance         = 0;
    uint constant                           historySize     = 500;
    uint[]                                  history;

	mapping(address=>uint128[]) internal    userTickets;

	mapping(uint128=>address[])             tickets;
	uint128[]					            ticketsIndex;
	uint						            ticketPrice     = 2000000000000000;    // 0.002E (1,000,000,000,000,000,000 = 1eth)

    function terminate() onlyOwner public {
        uint totalTransfer  = 0;
        state               = STATE.DISABLE;

		for(uint i=0 ; i<ticketsIndex.length ; i++)
		    for(uint j=0 ; j < tickets[ticketsIndex[i]].length ; j++ )
		        totalTransfer   +=transfer(tickets[ticketsIndex[i]][j], ticketPrice, address(this).balance-totalTransfer, 0);

        totalTransfer +=updatePending();
        
        if(pendingTransfer.length==0)
            msg.sender.transfer(address(this).balance-totalTransfer);
    }

	function information() public constant returns (uint,STATE, uint[], uint,uint,uint,uint,uint128[]) {
		return (round,state,history,ticketPrice,balance,transferFee,pendingTransfer.length,userTickets[msg.sender]);
	}
	function setTicketPrice(uint _price) onlyOwner isTrue((state!=STATE.BET)||(state!=STATE.BETEND)) isTrue((0<_price)&&(0<(int(_price)-int(transferFee)))) public {
		ticketPrice = _price;
	}

    event eventUpdate(uint,STATE,uint[]);
    
	function update(uint _seed) onlyOwner public {
		if(state==STATE.READY) {
			state	= STATE.BET;
		} else if(state==STATE.BET) {
			state	= STATE.BETEND;
			updatePending();
		} else if(state==STATE.BETEND) {
			state	= STATE.ROUNDEND;
			lottoRoundEnd(_seed);
		} else if(state==STATE.ROUNDEND) {
            round++;
			state	= STATE.READY;
			lottoReady();
		}
		eventUpdate(round,state,history);
	}

	function lottoReady() private {
        for(uint i = 0 ; i < ticketsIndex.length ; i++) {
			for(uint j = 0 ; j < tickets[ticketsIndex[i]].length ; j++)
				userTickets[tickets[ticketsIndex[i]][j]].length = 0;
			delete tickets[ticketsIndex[i]];
		}
		ticketsIndex.length	= 0;
	}
	function updateHistory(uint128 _prizeNumbers, uint128 _bonusNumber ) internal {
        if(history.length<historySize)
		    history.push((uint(_prizeNumbers)<<128)|uint(_bonusNumber));
        else {
            for(uint i = 0 ; i < (history.length-1) ; i++)
                history[i] = history[i+1];
            history[history.length-1] = (uint(_prizeNumbers)<<128)|uint(_bonusNumber);
        }
	}

	function prizeX(uint128 _prizeNumbers, uint _prize) internal returns (uint) {
		uint totalTransfer	= 0;
		for(uint i=0 ; i < tickets[_prizeNumbers].length && _prize>0 ; i++)
            totalTransfer   +=transfer(tickets[_prizeNumbers][i], _prize, address(this).balance-totalTransfer, transferFee);
		return totalTransfer;
	}

    function lottoRoundEnd(uint _seed) internal ;
}