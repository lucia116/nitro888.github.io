let storage	= new function() {
	this.wallet		= '';
	this.address		= '';
	this.tx			= '';
	this.time		= 0;
	this.load		= function() {
		if(!storage.hasData())
			return;
		let data	= JSON.parse(localStorage[CONFIG['network']['provider']]);
		storage.wallet	= data.wallet;
		storage.address	= data.address;
		storage.time		= data.time;
	};
	this.save		= function() {
		localStorage[CONFIG['network']['provider']] = storage.wallet!=''?JSON.stringify({'wallet':storage.wallet,'address':storage.address,'tx':storage.tx,'time':storage.time}):'';
	};
	this.hasData		= function() {
		return (typeof localStorage[CONFIG['network']['provider']] !== 'undefined' && localStorage[CONFIG['network']['provider']] != '');
	};
	this.hasStorage	= function() {
		return (typeof(Storage) !== "undefined");
	};
	this.remove		= function() {
		storage.wallet	= '';
		storage.address	= '';
		storage.tx		= '';
		localStorage.removeItem(CONFIG['network']['provider']);
	};
	this.reset		= function() {
		storage.address	= '';
		storage.time		= 0;
	};
};

let wallet	= new function() {
	this.web3			= null;
	this.balance			= -2;
	this.stateBackup		= -1;
	this.timer			= 1800000;
	this.showEthNetwork	= function() {
		wallet.web3.version.getNetwork((e, r) => {
			  switch (r) {
			    case "1":	console.log('This is mainnet');								break;
			    case "2":	console.log('This is the deprecated Morden test network.');	break;
			    case "3":	console.log('This is the ropsten test network.');				break;
			    default:		console.log('This is an unknown network.('+r+')');
			  }
			});
	};
	this.state			= function() {
		if (storage.hasStorage() && storage.hasData() && storage.wallet != '') {
			if(storage.address!=='')
				return 2;
			else
				return 1;	
		}
		return 0;
	};
	this.start			= function() {
		if(!storage.hasStorage())
			$('#top-alert').html('<div class="alert alert-warning" role="alert">This browser is not support storage!</div>');
		else if(!storage.hasData()) {
			storage.remove();
		} else {
			storage.load();
			wallet.updateTimer(true);
		}

		const engine		= ZeroClientProvider({getAccounts: function(){},rpcUrl:CONFIG['network']['provider']});
		wallet.web3		= new Web3(engine);
		wallet.showEthNetwork();
		engine.on('block', wallet.updateBlock);
	};
	this.updateBlock		= function(block) {
		wallet.updateTimer(false);
		
		let temp		= wallet.state();
		
		if(temp==2) {
			wallet.web3.eth.defaultAccount		= storage.address;
			wallet.web3.settings.defaultAccount	= storage.address;				
			wallet.updateBalance(function(){/*todo*/});
		} else
			wallet.balance	= -1;

		UPDATE();		
		wallet.stateBackup	= temp;
	};
	this.updateTimer		= function(update) {
		let time = new Date().getTime();
		if(wallet.state()!=2)
			return;
		if(time > parseInt(storage.time) + wallet.timer) {
			storage.reset();
			storage.save();
			location.href	= location.origin;
		} else if(update)
			storage.time	= time;
		storage.save();
	};
	this.updateBalance			= function(callback) {
		wallet.web3.eth.getBalance(storage.address, function(e,r){if (!e) {wallet.balance=r.toNumber();callback();}});
	};

	// create
	this.create		= function() {
		if(!storage.hasStorage()) {
			modal.update('Create Fail','This browser is not support storage!');
			return;
		}

		let body			=	'<div style="overflow-x:auto;">' +
							'<center>Create wallet from <b>' + CONFIG['network']['name'] + '</b></center>' +
							'<center>Wallet data in your computer only.</center>' +
							'<center>If you clean up your browser. Be removed wallet data permanently too.</center><br/>' +
							'<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="pass1" type="password" class="form-control" placeholder="Password (Over 8 letters)" aria-label="Password (Over 8 letters)"></div>' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="pass2" type="password" class="form-control" placeholder="Password retype" aria-label="Password retype">' +
							'</div></div>';
		modal.update('Create wallet',body,'wallet.createOK()');
		modal.alert('<div class="alert alert-danger font-weight-bold" role="alert"><center>Don\'t forget your password. And MUST backup your wallet.</center></div>');
	};
	this.getPrivateKeyString	= function(password) {
		let privateKey	= null;
		try {
			let temp		= keythereum.recover(password, JSON.parse(storage.wallet));
			privateKey	= Array.prototype.map.call(temp, x => ('00' + x.toString(16)).slice(-2)).join('');
		} catch (e) {
			privateKey	= null;
		}
		return privateKey;
	};
	this.getPrivateKeyBuffer	= function(password) {
		let privateKey	= null;
		try {
			privateKey	= keythereum.recover(password, JSON.parse(storage.wallet));
		} catch (e) {
			privateKey	= null;
		}
		return privateKey;
	};
	this.createOK	= function() {
		let p1	= $('#pass1').val();
		let p2	= $('#pass2').val();

		if(p1===p2 && p1.length > 7) {
			let dk				= keythereum.create();
			let keyObject		= keythereum.dump(p1, dk.privateKey, dk.salt, dk.iv);
			
			keyObject.isMainNet	= CONFIG['network']['isMainNet'];
			storage.wallet		= JSON.stringify(keyObject);
			storage.reset();
			storage.save();
			
			UPDATE();

			modal.update('Create','Success create your new account.');
			modal.alert('<div class="alert alert-danger font-weight-bold" role="alert"><center>Don\'t forget your password. And must backup your wallet.</center></div>');
		} else {
			if(p1!=p2) {
				modal.alert('<div class="alert alert-warning" role="alert">Passwords are not same</div>');
			} else {
				modal.alert('<div class="alert alert-warning" role="alert">password is TOO short</div>');
			}
		}
	}
	// create
	
	// login&out
	this.logIn			= function() {
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="loginPass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Login',body,'wallet.logInOK()');
	};
	this.logInOK			= function() {
		let password		= $('#loginPass').val();
		
		try {
			keythereum.recover(password, JSON.parse(storage.wallet));
			wallet.loginWithPK();
		} catch (e) {
			if(password!='')
				modal.alert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else
				modal.alert('<div class="alert alert-warning" role="alert">Password is empty</div>');			
		}
	}
	this.loginWithPK		= function() {
		wallet.web3.version.getNetwork((e, r) => {
				let data	= JSON.parse(storage.wallet);
				if((r==1&&data.isMainNet)||(r==3&&!data.isMainNet)) {
					wallet.web3.eth.defaultAccount			= '0x'+data.address;
					wallet.web3.settings.defaultAccount		= '0x'+data.address;
					
					storage.address	= '0x'+data.address;
					storage.time		= new Date().getTime();
					storage.save();

					UPDATE();
					
					modal.update('Login','Login Success');
				} else  {
					modal.update('Login','Login Fail');
					return;					
				}
			});
	};
	this.logOut			= function() {
		modal.update('Logout','Are you sure?','wallet.logOutOK()');
	};
	this.logOutOK		= function() {
		storage.reset();
		storage.save();
		UPDATE();

		modal.update('Logout','See you next time.');

		if(page.parameter['game']!=-1||page.parameter['contract']!='')
			setTimeout(function(){storage.reset();storage.save();location.href=location.origin;},2000);
	};
	// login&out
	
	// destory
	this.destory			= function() {
		let body			=	'<p class="text-danger">Destroy Wallet.</p>' +
							'<div style="overflow-x:auto;">' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="destoryPass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Destory',body,'wallet.destroyOK()');
	};
	this.destroyOK		= function() {
		let password		= $('#destoryPass').val();

		try {
			keythereum.recover(password, JSON.parse(storage.wallet));
			storage.remove();
			wallet.logOutOK();
			modal.update('Destory','Destory wallet complete');
		} catch (e) {
			if(password!='')
				modal.alert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else
				modal.alert('<div class="alert alert-warning" role="alert">Password is empty</div>');			
		}
	};
	// destory
	
	// export & import
	this.export	= function() {
		wallet.updateTimer(true);
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="exportPass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Export Wallet',body,'wallet.exportOK()');
	};
	this.exportOK	= function() {
		let password		= $('#exportPass').val();
		
		try {
			let privateKey		= keythereum.recover(password, JSON.parse(storage.wallet));
			modal.update('Export Wallet','<div style="overflow-x:auto;"><small>'+storage.wallet+'</small></div>');
		} catch (e) {
			if(re=='')
				modal.alert('<div class="alert alert-warning" role="alert">Password is empty</div>');
			else
				modal.alert('<div class="alert alert-warning" role="alert">Password is wrong</div>');			
		}
	};
	this.restore	= function() {
		if(!storage.hasStorage()) {
			page.modalUpdate('Restore Fail','This browser is not support storage!');
			return;
		}

		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group mb-3"><input id="restoreStr" type="text" class="form-control" placeholder="Restore string" aria-label="Restore string"></div>' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="restorePass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Restore',body,'wallet.restoreOK()');
	};
	this.restoreOK	= function() {
		let password		= $('#restorePass').val();
		let restore		= $('#restoreStr').val();
		let keyObject	= JSON.parse(restore);
		
		try {
			let privateKey		= keythereum.recover(password, keyObject);
			storage.wallet		= JSON.stringify(keyObject);
			storage.reset();
			storage.save();
			page.modalUpdate('Restore','Restore wallet complete');
		} catch (e) {
			if(password!=''&&restore!='')
				modal.alert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else if(restore=='')
				modal.alert('<div class="alert alert-warning" role="alert">Restore string is empty</div>');
			else if(password=='')
				modal.alert('<div class="alert alert-warning" role="alert">Restore password is empty</div>');			
		}
	};
	// export & import
	
	// deposit & withdrawal
	this.deposit			= function() {
		wallet.updateTimer(true);
		let body	= '<div align="center"><p class="text-warning">!! WARNING! THIS NETWORK IS '+CONFIG['network']['name']+' !!</p></div>';
		body		+="<div align='center'><img src='https://api.qrserver.com/v1/create-qr-code/?data="+storage.address+"&size=256x256 alt='' width='256' height='256'/></div><br/>";
		body		+="<div align='center'><a class='text-primary' target='_blank' href='"+CONFIG['network']['ethscan']+"/address/"+storage.address+"'>"+storage.address+"</a></div>";
		modal.update('Deposit',body);
	};
	this.withrawal		= function() {
		wallet.updateTimer(true);
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">account_balance_wallet</i></span></div><input id="withrawalAdr" type="text" class="form-control" placeholder="Withrawal Address" aria-label="Withrawal Address"></div>' +
							'<div class="input-group mb-3"><input id="withrawalVal" type="number" step="any" class="form-control" placeholder="Withrawal Amount" aria-label="Withrawal Amount"></div>' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="withrawalPass" type="password" class="form-control" placeholder="Password" aria-label="Withrawal Password"></div>' +
							'</div>';
		modal.update('Withrawal',body,'wallet.withrawalOK()');
	};
	this.withrawalOK		= function() {
		let address		= $('#withrawalAdr').val();
		let amount		= $('#withrawalVal').val();
		let password		= $('#withrawalPass').val();
		modal.alert('');
		
		if(address==''||amount==0||amount==''||password==''||!wallet.web3.isAddress(address)||address==storage.address) {
			if(!wallet.web3.isAddress(address))	modal.alert('<div class="alert alert-warning" role="alert">Address is wrong</div>');
			else if(address=='')					modal.alert('<div class="alert alert-warning" role="alert">Address is empty</div>');
			else if(amount==0||amount=='')		modal.alert('<div class="alert alert-warning" role="alert">Withrawal is zero</div>');
			else if(password=='')				modal.alert('<div class="alert alert-warning" role="alert">Passward is empty</div>');
			else if(address==storage.address)	modal.alert('<div class="alert alert-warning" role="alert">This is your address</div>');
		} else {
			wallet.updateBalance(function(){
				if(wallet.balance>wallet.web3.toWei(amount,'ether')) {
					if(storage.tx != '') {
						wallet.web3.eth.getTransaction(storage.tx,function(e,r){
							if(!e)
								if(r.blockNumber==null || parseInt(r.blockHash) == 0) 
									modal.alert('<div class="alert alert-warning" role="alert">Transaction is pending : <br/><small><a target="_blank" href="'+CONFIG['network']['ethscan']+'/tx/'+storage.tx+'">'+storage.tx+'</a></small></div>');
								else {
									storage.tx	= '';
									storage.save();
									if(!wallet.sendTransaction(address,password,amount))
										modal.alert('<div class="alert alert-warning" role="alert">Password is wrong</div>');									
								}
							else
								modal.alert('<div class="alert alert-warning" role="alert">Transaction fail</div>');
						});
					} else {
						if(!wallet.sendTransaction(address,password,amount))
							modal.alert('<div class="alert alert-warning" role="alert">Password is wrong</div>');
					}
				} else {
					modal.alert('<div class="alert alert-warning" role="alert">Amount is too big. Less then '+wallet.web3.toWei(wallet.balance,'ether')+' Eth</div>');
				}
			});
		}
	};
	this.sendTransaction		= function(address,password,amount,data=null,gasLimit=40000) {
		let privateKey	= wallet.getPrivateKeyString(password);

		if(privateKey!=null) {
			wallet.web3.eth.getGasPrice(function(e,r){
				if(e!=null) {
					modal.alert('<div class="alert alert-warning" role="alert">Network error - getGasPrice</div>');
				} else {
					let gasPrice = wallet.web3.toHex(r.toNumber());
					wallet.web3.eth.getTransactionCount(storage.address,function(e,t){
						if(e!=null) {
							modal.alert('<div class="alert alert-warning" role="alert">Network error - getTransactionCount</div>');
						} else {
							let txParams		= {	'nonce'		:	wallet.web3.toHex(parseInt(t)),
												'gasPrice'	:	gasPrice, 
												'gasLimit'	:	wallet.web3.toHex(gasLimit),
												'to'			:	address, 
												'value'		:	wallet.web3.toHex(wallet.web3.toWei(amount, 'ether'))};
							if(data!=null)
								txParams['data']	= data;
							let tx			= new ethereumjs.Tx(txParams);
							tx.sign(new ethereumjs.Buffer.Buffer(privateKey, 'hex'));
							wallet.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(e,r) {if(e) modal.alert('<div class="alert alert-warning" role="alert">Transaction Fail ('+e.message+')</div>'); else {modal.alert('<div class="alert alert-warning" role="alert">Success <small>(<a target="_blank" href="'+CONFIG['network']['ethscan']+'/tx/'+r+'">'+r+'</a>)</small><div>');storage.tx=r;}});
						}
					});
				}
			});
			return true;
		}
		return false;
	};
	// deposit & withdrawal
	
	// history
	this.history			= function() {
		wallet.updateTimer(true);
		modal.update('Transaction History',"Now Loading");

		let jsonUrl	= CONFIG['network']['ethscan']+"/api?module=account&action=txlist&address="+storage.address+"&startblock=0&endblock=latest";
		$.getJSON(jsonUrl,function(data) {
			if(data["result"].length==0)
				modal.update('Transaction History',data["message"]);
			else {
					let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";
					
					for(i=data["result"].length-1;i>=0;i--){
						let date		= new Date(data["result"][i]["timeStamp"]*1000);
						let tx		= '<a target="_blank" href="'+CONFIG['network']['ethscan']+'/tx/' + data["result"][i]["hash"] + '">'+data["result"][i]["hash"]+'</a>';
						let from		= '<a target="_blank" href="'+CONFIG['network']['ethscan']+'/address/' + data["result"][i]["from"] + '">'+data["result"][i]["from"]+'</a>'; 
						let to		= '<a target="_blank" href="'+CONFIG['network']['ethscan']+'/address/' + data["result"][i]["to"] + '">'+data["result"][i]["to"]+'</a>';
						let value	= wallet.web3.fromWei(data["result"][i]["value"],'ether');

						//let gas		= data["result"][i]["gas"];
						//let gasPrice	= data["result"][i]["gasPrice"];
						//let gasUsed	= data["result"][i]["gasUsed"];
						//let input	= data["result"][i]["input"];						
						//value *= (data["result"][i]["from"]==storage.address)?-1:1;
						//table	+="<tr><td><div><h6>"+date+"</h6></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>Tx : "+tx+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>From : "+from+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>To : "+to+"</small></div></td><td align='right'>"+value+" ETH</td></tr>";
						
						if(data["result"][i]["from"]==storage.address) {
							value *= -1;
							table	+="<tr><td><div><h6>"+date+"</h6></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>Tx : "+tx+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>To : "+to+"</small></div></td><td align='right'>"+value+" ETH</td></tr>";
						} else {
							table	+="<tr><td><div><h6>"+date+"</h6></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>Tx : "+tx+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>From : "+from+"</small></div></td><td align='right'>"+value+" ETH</td></tr>";
						}
					}
					table		+= "</tbody></table></div>";
					modal.update('Transaction History',table);
				}			
			});
	};
	// history
};

let contracts	= new function() {
	this.start		= function() {
		contracts.create('lotto953');
		contracts.create('baccarat');
		contracts.create('dragonTiger');
		contracts.create('highLow');
	};
	this.create		= function(game) {
		for(let i=0;i<CONFIG[game]['address'].length;i++)
			CONFIG[game]['contracts'][CONFIG[game]['address'][i]]	= wallet.web3.eth.contract(CONFIG[game]['abi']).at(CONFIG[game]['address'][i]);
	};
	this.info		= function(game,address,callback) {
		if(CONFIG[game]['contracts'][address]!=null)
			CONFIG[game]['contracts'][address].information(function(e,r){if (!e){CONFIG[game]['informations'][address]=r;callback(game,address,r);}});
	};
	this.infoArray	= function(game,address,callback) {
		for(let i=0;i<address.length;i++)
			contracts.info(game,address[i],callback);
	};
	this.buy			= function(game,address,tickets,password,callback) {
		if(CONFIG[game]['contracts'][address]!=null) {
			if(!wallet.sendTransaction(address,password,parseFloat(wallet.web3.fromWei(CONFIG[game]['informations'][address][3].toNumber()*tickets.length,'ether')),ethereumjs.Util.bufferToHex(ethereumjs.ABI.simpleEncode("buy(uint128[])", tickets))))
				callback('<div class="alert alert-warning" role="alert">Password is wrong</div>');
		}
	};
};

let modal	= new function() {
	this.update	= function(title, body, foot='', alert=''){
		let dismiss	= '<button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>';
		$('#modalTitle').html(title);
		$('#modalAlert').html(alert);
		$('#modalBody').html(body);
		$('#modalFooter').html(foot===''?dismiss:'<button type="button" class="btn btn-primary" onClick="script:'+foot+'">Confirm</button>'+dismiss);
	};
	this.alert	= function(alert=''){
		$('#modalAlert').html(alert);
	};		
};

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
	this.updateBalance		= function() {
		// todo : show balance
		if(wallet.state()==2&&wallet.balance>=0)
			console.log("page.updateBalance : " + wallet.balance);
		else
			console.log("page.updateBalance : " + "");
	},
	this.updateNavAccount	= function(state) {
		switch(wallet.state())
		{
			case 0:
				$('#navAccount').html(	'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.create()">Create</a>'+
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.restore()">Restore</a>' );					
				break;
			case 1:
				$('#navAccount').html(	'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.logIn()">Login</a>' );					
				break;
			case 2:
				$('#navAccount').html(	
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.deposit()">Deposit</a>' +
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.withrawal()">Withrawal</a>' +
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.history()">History</a>' +
										'<div class="dropdown-divider"></div>' +
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.export()">Export</a>' +
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.destory()">Destroy</a>' +
										'<div class="dropdown-divider"></div>' +
										'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modlg" onClick="script:wallet.logOut()">Logout</a>' );
				break;
		}
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
	};
	this.play		= function(game,address) {
		wallet.updateTimer(true);
		location.href	= location.origin+'/game/?g='+game+'&a='+address;
	}
};

// main
let CONFIG	= null;
$.getJSON('config.json', function(data) {
	if(data!=null) {
		CONFIG	= data;
		page.start();
		wallet.start();
		contracts.start();
	}
});
let UPDATE = function () {
	let temp	= wallet.state();
	
	console.log('update here',temp);
	
	if(temp!=wallet.stateBackup)
		page.updateNavAccount(temp);
	
	page.updateBalance();

	contracts.infoArray('lotto953',		CONFIG['lotto953']['address'],	function(_game,_contract,_data){page.updateLotto(_game,_contract,_data);});					
	contracts.infoArray('baccarat',		CONFIG['baccarat']['address'],	function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});
	contracts.infoArray('dragonTiger',	CONFIG['dragonTiger']['address'],function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});
	contracts.infoArray('highLow',		CONFIG['highLow']['address'],	function(_game,_contract,_data){page.updateCasino(_game,_contract,_data);});

	wallet.stateBackup	= temp;
};
//main