pragma solidity ^0.4.19;

import "./lotto.sol";

contract lotto953 is lotto {
	uint8 constant              ballCount	        = 9;    // must be under 128
	uint8 constant              matchCount	        = 5;    // match 5 & bonus 1

	uint constant               percentMaintenance  = 20;   // 20%
	uint constant               percent1stPrize     = 25;   // 25%
	uint constant               percent2ndPrize     = 20;   // 20%
	uint constant               prize3rd            = 2;

	function lottoRoundEnd(uint _seed) internal {
	    uint128[] memory	balls	    = machine.balls(ballCount);
		uint128		    	prizeNumbers= 0;
		uint128		    	bonusNumber = 0;
		uint		    	totalPrize  = 0;
		uint                tempBalance = 0;
        
        (prizeNumbers,bonusNumber)  = machine.lotto(ballCount,matchCount,block.coinbase,lastUser,_seed|(history.length>0?history[history.length-1]>>128:ballCount));

		totalPrize          = prize3(balls, prizeNumbers);                              // 3th	- match 3 numbers
		tempBalance         = balance-totalPrize;
		totalPrize		    +=prize2(balls, prizeNumbers, bonusNumber, tempBalance);    // 2nd	- match 4 numbers + 1 bonus number
		totalPrize		    +=prize1(prizeNumbers, tempBalance);                        // 1st	- match all numbers

		balance	            = balance-totalPrize;
        uint save		    = utils.percent(balance, percentMaintenance);          // save 20% for maintenance
		balance     	    -=save;
		ownerBalance	    +=save;

        updateHistory(prizeNumbers,bonusNumber);
	}

	function prize1(uint128 _prizeNumbers, uint _balance) private returns (uint) {
		uint prize	= tickets[_prizeNumbers].length>0? utils.percent(_balance,percent1stPrize) / tickets[_prizeNumbers].length : 0;	        // 25% / members
		return prizeX(_prizeNumbers,prize);
	}
    function prize2(uint128[] _balls, uint128 _prizeNumbers, uint128 _bonusNumber, uint _balance) private returns (uint) {
        uint winner2        = 0;

		for(uint i=0 ; i<ticketsIndex.length ; i++)
			if(machine.matchLotto(ticketsIndex[i]&_prizeNumbers,_balls,matchCount-1)&&(ticketsIndex[i]&_bonusNumber>0))
			    winner2 +=tickets[ticketsIndex[i]].length;

        uint totalTransfer = 0;
        uint prize          = winner2>0?utils.percent(_balance, percent2ndPrize) / winner2 : 0;                           // 20% / members

		for(i=0 ; i<ticketsIndex.length ; i++)
            if(machine.matchLotto(ticketsIndex[i]&_prizeNumbers,_balls,matchCount-1)&&(ticketsIndex[i]&_bonusNumber>0)&&(prize>0))
                totalTransfer += prizeX(ticketsIndex[i],prize);

		return totalTransfer;
	}
	function prize3(uint128[] _balls, uint128 _prizeNumbers) private returns (uint) {
        uint totalTransfer = 0;
        for(uint i=0 ; i<ticketsIndex.length ; i++)
            if(machine.matchLotto(ticketsIndex[i]&_prizeNumbers,_balls,matchCount-2))
                totalTransfer +=prizeX(ticketsIndex[i],ticketPrice*prize3rd);
        return totalTransfer;
	}

	function buy(uint128[] _tickets) payable isTrue((msg.value == ticketPrice*_tickets.length) && state==STATE.BET) public returns (uint128[]){
        require(machine.validateLottoTicket(_tickets,ballCount,matchCount));    // check 9-5
		for(uint i = 0 ; i <  _tickets.length ; i++) {
			if(tickets[_tickets[i]].length==0)
				ticketsIndex.push(_tickets[i]);		
			tickets[_tickets[i]].push(msg.sender);
			userTickets[msg.sender].push(_tickets[i]);
		}
		lastUser	= msg.sender;
		balance     +=msg.value;
		return userTickets[msg.sender];
	}
}