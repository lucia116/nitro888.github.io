let util	= new function() {
	this.historyRow			= 6,
	this.historyCol			= 140,
	this.win				= function(game,openCards) {
		let win		= 0;
		let toolTip	= '';
		
		switch(game){
			case 'baccarat':
				let b	= (util.cut10(util.card(openCards['1st'][0]))+util.cut10(util.card(openCards['1st'][1])))%10;
				b		= openCards['1st'][2]==0?b:(b+util.cut10(util.card(openCards['1st'][2])))%10;
				let p	= (util.cut10(util.card(openCards['2nd'][0]))+util.cut10(util.card(openCards['2nd'][1])))%10;
				p		= openCards['2nd'][2]==0?p:(p+util.cut10(util.card(openCards['2nd'][2])))%10;
				toolTip = '('+b+','+p+')';
				win 		= b>p?1:b<p?2:3;
				break;
			case 'dragonTiger':
				let d	= util.card(openCards['1st'][0]);
				let t	= util.card(openCards['2nd'][0]);
				toolTip = '('+d+','+t+')';
				win 		= d>t?1:d<t?2:3;
				break;
			case 'highLow':
				let c1	= util.card(openCards['1st'][0]);
				let c2	= util.card(openCards['2nd'][0]);
				toolTip = '('+c1+','+c2+')';
				win 		= c2>c1?1:c2<c1?2:3;
				break;
		}

		return {'win':win,'toolTip':toolTip};
	},
	this.card			= function(index) {
		return (index-1)%13+1;
	},
	this.cut10			= function(num) {
		return num>9?0:num;
	},
	this.openCards		= function(raw) {
		return {'1st':[util.bitwise(raw,0),util.bitwise(raw,8),util.bitwise(raw,16),util.bitwise(raw,24)],'2nd':[util.bitwise(raw,32),util.bitwise(raw,40),util.bitwise(raw,48),util.bitwise(raw,56)]};
	},
	this.bitwise			= function(num, from, size=8) {
		let length	= 64;
		let str		= num.toString(2);
		if (str.length < length) str = Array(length - str.length + 1).join("0") + str;
		return parseInt( str.slice(length-from-size,str.length-from), 2 );
	},
	this.binaryString	= function(num,length=64) {
		let str		= num.toString(2);
		if (str.length < length) str = Array(length - str.length + 1).join("0") + str;
		return str;
	},
	this.getGameState	= function (state) {
		let result	= '';
		switch(state) {
		case 0:
			result = "Ready";
			break;
		case 1:
			result = "Open";
			break;
		case 2:
			result = "Close";
			break;
		case 3:
			result = "Game";
			break;
		}
		return result;
	},
	this.ticketLottoMark	= function (ticket,max,mark) {
		if(util.ticketLottoMarkCount(ticket,max)>mark)
			return false;
		return true;
	},
	this.ticketLottoMarkCount = function (ticket,max) {
		let count = 0;
		for(let i=0;i<max;i++)
			if($('#t'+ticket+'_'+i).prop('checked'))
				count++;
		return count;
	},
	this.ticketLottoRandom=function (ticket,max,mark) {
		let marks	= [];
		
		for(let k=0;k<max;k++)
			marks.push(k);

		for(let i=0;i<marks.length;i++) {
			$('#t'+ticket+'_'+i).prop('checked',false);
			
			let s = Math.floor(Math.random() * marks.length);
			let b = marks[i];
			marks[i] = marks[s];
			marks[s] = b;
		}

		for(let j=0 ; j<mark ; j++)
			$('#t'+ticket+'_'+marks[j]).prop('checked',true);
	},
	this.updateCasino	= function(game,address,data) {
		let history = new Array();

		for(let i = 0 ; i < data[2].length ; i++)
			history.push(util.openCards(data[2][i].toNumber()));

		for(let i = 0 ; i < util.historyRow ; i ++)
			for(let j = 0 ; j < util.historyCol ; j++)
				$('#history_'+game+'_'+address+'_'+j+'_'+i).html('&nbsp');

		let red		= "<i class='material-icons' style='font-size:16px;color:red'>brightness_1</i>";
		let blue		= "<i class='material-icons' style='font-size:16px;color:blue'>brightness_1</i>";
		let green	= "<i class='material-icons' style='font-size:16px;color:green'>brightness_1</i>";

		let x1		= 0;
		let x2		= 0;
		let y		= 0;
		let b		= -1;

		$('#rnd_'+game+'_'+address).html("Round "+data[0][0].toNumber()+"-"+data[0][1].toNumber()+"-"+data[0][2].toNumber()+'<small> ('+util.getGameState(parseInt(data[1]))+')</small>');
		
		for(let i = 0 ; i < history.length ; i++){
			let 	temp		= util.win(game,history[i]);
			let win		= temp['win'];
			let toolTip	= temp['toolTip'];

			if(b==win) {
				if(y == (util.historyRow-1) || $('#history_'+game+'_'+address+'_'+x1+'_'+(y+1)).html()!='&nbsp;' ) {
					x2++;
				} else {
					y++;
				}
			} else if(b!=-1) {
				x1++;
				x2	= 0;
				y	= 0;
			}

			let marker		= '!';

			if(win==1)		marker = red;	// banker, dragon, high
			else if(win==2)	marker = blue;	// player, tigher, low
			else if(win==3)	marker = green;	// tie

			$('#history_'+game+'_'+address+'_'+(x1+x2)+'_'+y).html('<a style="cursor:hand" data-toggle="tooltip" title="'+toolTip+'">'+marker+'</a>');

			b = win;
		}
	}
}