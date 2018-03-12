let contracts	= new function() {
	this.start		= function() {
		contracts.create('lotto953');
		contracts.create('baccarat');
		contracts.create('dragonTiger');
		contracts.create('highLow');
	},
	this.create		= function(game) {
		for(let i=0;i<CONFIG[game]['address'].length;i++)
			CONFIG[game]['contracts'][CONFIG[game]['address'][i]]	= wallet.web3.eth.contract(CONFIG[game]['abi']).at(CONFIG[game]['address'][i]);
	},
	this.info		= function(game,address,callback) {
		if(CONFIG[game]['contracts'][address]!=null)
			CONFIG[game]['contracts'][address].information(function(e,r){if (!e){CONFIG[game]['informations'][address]=r;callback(game,address,r);}});
	},
	this.infoArray	= function(game,address,callback) {
		for(let i=0;i<address.length;i++)
			contracts.info(game,address[i],callback);
	},
	this.buy			= function(game,address,tickets,password,callback) {
		if(CONFIG[game]['contracts'][address]!=null) {
			if(!wallet.sendTransaction(address,password,parseFloat(wallet.web3.fromWei(CONFIG[game]['informations'][address][3].toNumber()*tickets.length,'ether')),ethereumjs.Util.bufferToHex(ethereumjs.ABI.simpleEncode("buy(uint128[])", tickets))))
				callback('<div class="alert alert-warning" role="alert">Password is wrong</div>');
		}
	}
}

let page		= new function() {
	this.start				= function() {
		page.startLotto('lotto953','#historyLotto935',6,3,3);
		page.startCasino('baccarat','#historyBaccarat');
		page.startCasino('dragonTiger','#historyDragonTiger');
		page.startCasino('highLow','#historyHighLow');
	},
	this.startLotto			= function(game,id,cnt,x,y) {
		let body		= '';
		let address	= CONFIG[game]['address'][0];

		body			+='<table style="width:100%"><tr><td id="rnd_'+game+'_'+address+'" class="h4">Round</td><td style="float:right;"><small id="btn_'+game+'_'+address+'"></small></td></tr></table>';
		body			+="<div class='row'>";
		for(let i=0 ; i < cnt ; i++) {
			body		+='<div class="col-md-'+(12/cnt)+' panel"><div><small id="round_'+game+'_'+address+'_'+i+'">Round</small></div><div class="card-text">';
			body		+='<table class="border border-secondary" style="width:100%;border-collapse: collapse;">';
			for(let j=0 ; j < y ; j++) {
				body+='<tr>';
				for(let k=0 ; k < x ; k++)
					if((j*x+k)%2==0)
						body+="<td style='align-middle;' bgcolor='#DEDEDE'><div align='center' valign='middle' id='"+game+'_'+address+"_"+i+"_"+(j*x+k)+"'>&nbsp</div></td>";
					else
						body+="<td style='align-middle;' class='bg-light'><div align='center' valign='middle' id='"+game+'_'+address+"_"+i+"_"+(j*x+k)+"'>&nbsp</div></td>";
				body+='</tr>';
			}
			body		+='</table></div></div>';
		}
		body			+='</div>';
		body			+='<div class="row"><div class="col-md-6"><small id="pot_'+game+'_'+address+'"></small></div><div class="col-md-6"><small style="float:right;" id="price_'+game+'_'+address+'"></small></div></div>';
		
		$(id).html(body);		
	},
	this.startCasino			= function(game,id) {
		let body		= '';
		
		for(let k=0;k<CONFIG[game]['address'].length;k++) {
			let address	= CONFIG[game]['address'][k];

			body		+='<table style="width:100%"><tr><td id="rnd_'+game+'_'+address+'" class="h4">Round</td><td style="float:right;"><small id="btn_'+game+'_'+address+'"></small></td></tr></table>';
			body		+="<div style='overflow-x:auto;'><table class='border border-secondary'>";
			for(let i = 0 ; i < util.historyRow ; i ++){
				body +="<tr>";
				for(let j = 0 ; j < util.historyCol ; j++)
					if((i*3+j)%2==0)
						body	+="<td class='align-middle' bgcolor='#DEDEDE'><div style='width:16px;' id='history_"+game+'_'+address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
					else
						body	+="<td class='align-middle bg-light'><div style='width:16px;' id='history_"+game+'_'+address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
				body	+="</tr>";
			}
			body		+="</table></div>";
			body		+='<div class="row"><div class="col-md-6"><small id="pot_'+game+'_'+address+'"></small></div><div class="col-md-6"><small style="float:right;" id="price_'+game+'_'+address+'"></small></div></div>';
		}
		
		$(id).html(body);		
	},
	this.updateBtn			= function(game,address) {
		let btn		= '<button data-toggle="modal" data-target="#modlg" type="button" class="btn btn-link btn-sm text-secondary" onClick="page.showInfo(\''+game+'\',\''+address+'\')"><i class="material-icons" style="font-size:20px;">announcement</i></button>';
		let max		= 0;
		let mark		= 0;
		
		// todo : more lotto
		switch(game) {
		case 'lotto953':
			max	= 9;
			mark	= 5;
			btn	='<button data-toggle="modal" data-target="#modlg" type="button" class="btn btn-link btn-sm text-secondary" onClick="page.showHistory(\''+game+'\',\''+address+'\','+max+')"><i class="material-icons" style="font-size:20px;">history</i></button>'+btn;
			if(wallet.state()==2)
				btn	='<button data-toggle="modal" data-target="#modlg" type="button" class="btn btn-link btn-sm text-secondary" onClick="page.ticket(\''+game+'\',\''+address+'\','+max+','+mark+')"><i class="material-icons" style="font-size:20px;">create</i></button>'+btn;
		break;
		default:
			if(wallet.state()==2)
				btn	='<button type="button" class="btn btn-link btn-sm text-secondary" onClick="page.play(\''+game+'\',\''+address+'\')"><i class="material-icons" style="font-size:20px;">create</i></button>'+btn;
			break;
		}
		// todo : more lotto		
		
		return	btn;
	},
	this.showInfo		= function(game,address) {
		modal.update(CONFIG[game]['name'],'Now Loading...');
		wallet.updateTimer(true);

		contracts.info(game,address,function(_game,_address,_data){
				let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";

				table		+='<tr><td>Contract</td><td><a style="cursor:hand" onClick="window.open(\''+CONFIG['network']['ethscan']+'/address/'+_address+'\',\'_blank\')"><small>'+_address+"</small></td></tr>";
				table		+="<tr><td>State</td><td>"+util.getGameState(parseInt(_data[1]))+"</td></tr>";

				if(game!='lotto953') {
					table		+="<tr><td>Round</td><td>"+_data[0][0] +"-" + _data[0][1] +"-" + _data[0][2]+"</td></tr>";
					table		+="<tr><td>Bet</td><td>"+wallet.web3.fromWei(_data[4])+" ETH</td></tr>";
					table		+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(_data[6])+" ETH</td></tr>";
					table		+="<tr><td>Pending transfer</td><td>"+_data[11]+" remains</td></tr>";
					table		+="<tr><td>Bankers Deposit</td><td>"+wallet.web3.fromWei(_data[7])+" ETH </td></tr>";
					table		+="<tr><td>Bankers</td><td>"+_data[8].length+" / "+ _data[9].toNumber()+" accounts </td></tr>";
					table		+="<tr><td>Waitings</td><td>"+_data[10].length+" accounts </td></tr>";
				} else {
					table		+="<tr><td>Round</td><td>"+_data[0]+"</td></tr>";
					table		+="<tr><td>Price</td><td>"+wallet.web3.fromWei(_data[3])+" ETH</td></tr>";
					table		+="<tr><td>Balance</td><td>"+wallet.web3.fromWei(_data[4])+" ETH</td></tr>";
					table		+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(_data[5])+" ETH</td></tr>";
					table		+="<tr><td>Pending transfer</td><td>"+_data[6]+" remains</td></tr>";
					table		+="<tr><td>My tickets</td><td>"+_data[7]+"</td></tr>";
				}
				
				table		+="</tbody></table></div>";
				modal.update(CONFIG[game]['name'],table);
			});
	},
	this.showHistory= function (game,address,max) {
		let marker	= [];
		for(let i = 0 ; i < max ; i++)
			marker.push(1<<i);
		
		let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";

		for(let i = CONFIG[game]['informations'][address][2].length-1, k = CONFIG[game]['informations'][address][0].toNumber()-1 ; i > -1 ; i--, k--) {
			let temp		= CONFIG[game]['informations'][address][2][i].toString(2);
			let prize	= parseInt(temp.substring(0,temp.length-128),2);
			let bonus	= parseInt(temp.substring(temp.length-128,temp.length),2);
			let numbers	= '';

			for(let j = 0 ; j < marker.length ; j++ ) {
				if((marker[j]&prize)>0)	numbers +='<a style="opacity: 1; color: #000000;">&#93'+(12+j)+'</a>';
				if((marker[j]&bonus)>0)	bonus	= '<a style="opacity: 1; color: #FF5722;">&#93'+(12+j)+'</a>';				
			}

			table	+="<tr><td><div><center><small>R."+k+"</small></center></div><div><td>"+numbers+"&nbsp"+bonus+"</td></tr>";
		}

		table		+= "</tbody></table></div>";
		modal.update('History',table);
		wallet.updateTimer(true);
	},
	this.updateLotto		= function(game,address,data) {
		$('#rnd_'+game+'_'+address).html("Round "+data[0].toNumber()+'<small> ('+util.getGameState(parseInt(data[1]))+')</small>');
		$('#btn_'+game+'_'+address).html(page.updateBtn(game,address));
		$('#price_'+game+'_'+address).html("Ticket : "+wallet.web3.fromWei(data[3].toNumber(),'ether')+" E");
		$('#pot_'+game+'_'+address).html("Pot : "+wallet.web3.fromWei(data[4].toNumber(),'ether')+" E");
		
		let marker			= [];
		let max				= 0;
		
		// todo : more lotto
		switch(game) {
		case 'lotto953':
			max = 9;
		break;
		}
		// todo : more lotto

		for(let i = 0 ; i < max ; i++)
			marker.push(1<<i);

		for(let i = (data[2].length>6 ? data[2].length-6 : 0), k = 0 ; i < data[2].length ; i++,k++)  {

			let temp		= data[2][i].toString(2);
			let prize	= parseInt(temp.substring(0,temp.length-128),2);
			let bonus	= parseInt(temp.substring(temp.length-128,temp.length),2);

			if(data[2].length<6)
				$('#round_'+game+'_'+address+'_'+k).html("Round "+(i+1));
			else
				$('#round_'+game+'_'+address+'_'+k).html("Round "+(data[0].toNumber()-6+k));
			
			for(let j = 0 ; j < marker.length ; j++ ) {
				let mark		= '&nbsp';
				if(marker[j]&prize) 			mark	= '<a style="opacity: 1; color: #000000;">&#93'+(12+j)+'</a>'; 	// todo
				else if(marker[j]&bonus)		mark= '<a style="opacity: 1; color: #FF5722;">&#93'+(12+j)+'</a>';	// todo 
				else							mark= '<a style="opacity: 0.2;">&#93'+(12+j)+'</a>';					// todo
				$('#'+game+'_'+address+'_'+k+'_'+j).html(mark);
			}
		}		
	},
	this.updateCasino	= function(game,address,data) {
		$('#btn_'+game+'_'+address).html(page.updateBtn(game,address));
		$('#price_'+game+'_'+address).html("Bet : "+wallet.web3.fromWei(data[4].toNumber(),'ether')+" E");
		util.updateCasino(game,address,data);
	},
	this.ticket	= function (game,address,max,mark) {
		let cnt			= 4;

		let tickets		= '<table class="table">';
		tickets			+='<thead><tr>';
		for(let i=0;i<cnt;i++)
			tickets		+='<th scope="col"><center>Ticket '+(i+1)+'</center></th>';
		tickets			+='</tr></thead>';
		
		tickets			+='<tbody>';		
		for(let j=0;j<max+1;j++) {
			tickets			+='</tr>';
			for(let k=0;k<cnt;k++)
				if(j==max)
					tickets		+='<td><center><button type="button" class="btn btn-secondary btn-sm" onClick="util.ticketLottoRandom('+k+','+max+','+mark+')">RANDOM</button></center></td>';
				else
					tickets		+='<td><center><div class="checkbox"><input type="checkbox" id="t'+k+'_'+j+'" onClick="return util.ticketLottoMark('+k+','+max+','+mark+')"> '+(j+1)+'</div></center></td>';
			tickets		+='</tr>';
		}
		tickets			+='</tbody>';
		tickets			+='</table>'; 
		
		tickets			+='<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="buyTicketPass-'+game+'" type="password" class="form-control" placeholder="Password" aria-label="Buy Ticket Password"></div>';

		modal.update('Ticket '+CONFIG[game]['name'],tickets,'page.ticketBuy(\''+game+'\','+cnt+','+max+','+mark+')');
		wallet.updateTimer(true);
	},
	this.ticketBuy=function(game,cnt,max,mark) {
		modal.alert('');
		wallet.updateTimer(true);
		
		let buyTicket = [];

		for(let i=0;i<cnt;i++) {
			if(util.ticketLottoMarkCount(i,max)==mark) {
				buyTicket.push(Array());
				for(let j=0;j<max;j++)
					if($('#t'+i+'_'+j).prop('checked'))
						buyTicket[buyTicket.length-1].push(j);
			}
		}
		
		let password		= $('#buyTicketPass-'+game).val();
		let contract		= CONFIG[game]['contracts'][CONFIG[game]['address'][0]];

		if(password=='')
			modal.alert('<div class="alert alert-warning" role="alert">Password is empty</div>');
		else if (buyTicket.length==0)
			modal.alert('<div class="alert alert-warning" role="alert">Marking please.</div>');
		else {
			let privateKey	= wallet.getPrivateKeyString(password);
			if(privateKey==null)
				modal.alert('<div class="alert alert-warning" role="alert">Password is wrong</div>');
			{
				wallet.updateBalance(function(){
					if(balance<=(buyTicket.length*CONFIG[game]['informations'][CONFIG[game]['address'][0]][3].toNumber()))
						modal.alert('<div class="alert alert-warning" role="alert">Balance is too low</div>');
					else
						contracts.info(game,CONFIG[game]['address'][0],function(_game,_address,_data){
							if((parseInt(_data[1])!=1)) {
								modal.alert('<div class="alert alert-warning" role="alert">Counter is not open!</div>');				
							} else {
								let tickets	= [];
								for(let i=0;i<buyTicket.length;i++) {
									let t = 0;
									for(let j=0;j<buyTicket[i].length;j++)
										t	+= (1<<buyTicket[i][j]);
									tickets.push(t);
								}
								contracts.buy(_game,_address,tickets,password,modal.alert);
							}
						});
				});
			}
		}
	},
	this.play		= function(game,address) {
		wallet.updateTimer(true);
		location.href	= location.origin+'/game/?g='+game+'&a='+address;
	}
}

// main
let UPDATE = function () {
	contracts.infoArray('lotto953',		CONFIG['lotto953']['address'],	function(_game,_contract,_data){page.updateLotto(_game,_contract,_data);});					
	contracts.infoArray('baccarat',		CONFIG['baccarat']['address'],	function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});
	contracts.infoArray('dragonTiger',	CONFIG['dragonTiger']['address'],function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});
	contracts.infoArray('highLow',		CONFIG['highLow']['address'],	function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});
}
$.getJSON('config.json', function(data) {
	if(data!=null) {
		CONFIG	= data;
		page.start();
		wallet.start(UPDATE);
		contracts.start();
	}
});
//main