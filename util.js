let CONFIG	= {};

let storage	= new function() {
	this.wallet		= '';
	this.address	= '';
	this.tx			= '';
	this.time		= 0;
	this.load		= function() {
		if(!storage.hasData())
			return;
		let data	= JSON.parse(localStorage[CONFIG['network']['provider']]);
		storage.wallet	= data.wallet;
		storage.address	= data.address;
		storage.time		= data.time;
	},
	this.save		= function() {
		localStorage[CONFIG['network']['provider']] = storage.wallet!=''?JSON.stringify({'wallet':storage.wallet,'address':storage.address,'tx':storage.tx,'time':storage.time}):'';
	},
	this.hasData		= function() {
		return (typeof localStorage[CONFIG['network']['provider']] !== 'undefined' && localStorage[CONFIG['network']['provider']] != '');
	},
	this.hasStorage	= function() {
		return (typeof(Storage) !== "undefined");
	},
	this.remove		= function() {
		storage.wallet	= '';
		storage.address	= '';
		storage.tx		= '';
		localStorage.removeItem(CONFIG['network']['provider']);
	},
	this.reset		= function() {
		storage.address	= '';
		storage.time		= 0;
	}
}

let wallet	= new function() {
	this.web3			= null;
	this.balance		= -2;
	this.stateBackup	= -1;
	this.timer			= 1800000;
	this.showEthNetwork	= function() {
		wallet.web3.version.getNetwork((e, r) => {
			  switch (r) {
			    case "1":	console.log('This is mainnet');								break;
			    case "2":	console.log('This is the deprecated Morden test network.');	break;
			    case "3":	console.log('This is the ropsten test network.');			break;
			    default:	console.log('This is an unknown network.('+r+')');
			  }
			});
	},
	this.state			= function() {
		if (storage.hasStorage() && storage.hasData() && storage.wallet != '') {
			if(storage.address!=='')
				return 2;
			else
				return 1;	
		}
		return 0;
	},
	this.start			= function(update) {
		if(!storage.hasStorage())
			$('#top-alert').html('<div class="alert alert-warning" role="alert">This browser is not support storage!</div>');
		else if(!storage.hasData()) {
			storage.remove();
		} else {
			storage.load();
			wallet.updateTimer(true);
		}

		const engine	= ZeroClientProvider({getAccounts: function(){},rpcUrl:CONFIG['network']['provider']});
		wallet.web3		= new Web3(engine);
		wallet.showEthNetwork();
		engine.on('block', function(){wallet.updateTimer(false);wallet.updateNavAccount();if(wallet.state()==2)wallet.updateBalance(function(){/*todo*/});else wallet.balance=-1;update();});
	},
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
	},
	this.updateBalance			= function(callback) {
		wallet.web3.eth.getBalance(storage.address, function(e,r){if (!e) {
			wallet.balance=r.toNumber();
			/*
			// todo : show balance
			if(wallet.state()==2&&wallet.balance>=0)
				console.log("html updateBalance : " + wallet.balance);
			else
				console.log("html updateBalance : " + "");
			// todo : show balance
			*/
			callback();
			}});
	},
	this.updateNavAccount	= function() {
		let temp	= wallet.state();
		if(temp==wallet.stateBackup)
			return;

		switch(temp)
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
		
		wallet.stateBackup	= temp;
	},

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
	},
	this.getPrivateKeyString	= function(password) {
		let privateKey	= null;
		try {
			let temp		= keythereum.recover(password, JSON.parse(storage.wallet));
			privateKey	= Array.prototype.map.call(temp, x => ('00' + x.toString(16)).slice(-2)).join('');
		} catch (e) {
			privateKey	= null;
		}
		return privateKey;
	},
	this.getPrivateKeyBuffer	= function(password) {
		let privateKey	= null;
		try {
			privateKey	= keythereum.recover(password, JSON.parse(storage.wallet));
		} catch (e) {
			privateKey	= null;
		}
		return privateKey;
	},
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
			
			wallet.updateNavAccount();
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
	},
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

					wallet.updateNavAccount();
					UPDATE();
					
					modal.update('Login','Login Success');
				} else  {
					modal.update('Login','Login Fail');
					return;					
				}
			});
	},
	this.logOut			= function() {
		modal.update('Logout','Are you sure?','wallet.logOutOK()');
	},
	this.logOutOK		= function() {
		storage.reset();
		storage.save();
		
		wallet.updateNavAccount();
		UPDATE();

		modal.update('Logout','See you next time.');
		setTimeout(function(){storage.reset();storage.save();location.href=location.origin;},2000);
	},
	// login&out
	
	// destory
	this.destory			= function() {
		let body	=	'<p class="text-danger">Destroy Wallet.</p>' +
						'<div style="overflow-x:auto;">' +
						'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="destoryPass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
						'</div>';		
		modal.update('Destory',body,'wallet.destroyOK()');
	},
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
	},
	// destory
	
	// export & import
	this.export	= function() {
		wallet.updateTimer(true);
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="exportPass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Export Wallet',body,'wallet.exportOK()');
	},
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
	},
	this.restore	= function() {
		if(!storage.hasStorage()) {
			page.modalUpdate('Restore Fail','This browser is not support storage!');
			return;
		}

		let body		=	'<div style="overflow-x:auto;">' +
							'<div class="input-group mb-3"><input id="restoreStr" type="text" class="form-control" placeholder="Restore string" aria-label="Restore string"></div>' +
							'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="restorePass" type="password" class="form-control" placeholder="Password" aria-label="Password"></div>' +
							'</div>';		
		modal.update('Restore',body,'wallet.restoreOK()');
	},
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
	},
	// export & import
	
	// deposit & withdrawal
	this.deposit			= function() {
		wallet.updateTimer(true);
		let body	= '<div align="center"><p class="text-warning">!! WARNING! THIS NETWORK IS '+CONFIG['network']['name']+' !!</p></div>';
		body		+="<div align='center'><img src='https://api.qrserver.com/v1/create-qr-code/?data="+storage.address+"&size=256x256 alt='' width='256' height='256'/></div><br/>";
		body		+="<div align='center'><a class='text-primary' target='_blank' href='"+CONFIG['network']['href']+"/address/"+storage.address+"'>"+storage.address+"</a></div>";
		modal.update('Deposit',body);
	},
	this.withrawal		= function() {
		wallet.updateTimer(true);
		let body	='<div style="overflow-x:auto;">' +
					 '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">account_balance_wallet</i></span></div><input id="withrawalAdr" type="text" class="form-control" placeholder="Withrawal Address" aria-label="Withrawal Address"></div>' +
					 '<div class="input-group mb-3"><input id="withrawalVal" type="number" step="any" class="form-control" placeholder="Withrawal Amount" aria-label="Withrawal Amount"></div>' +
					 '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="material-icons">lock</i></span></div><input id="withrawalPass" type="password" class="form-control" placeholder="Password" aria-label="Withrawal Password"></div>' +
					 '</div>';
		modal.update('Withrawal',body,'wallet.withrawalOK()');
	},
	this.withrawalOK		= function() {
		let address		= $('#withrawalAdr').val();
		let amount		= $('#withrawalVal').val();
		let password	= $('#withrawalPass').val();
		modal.alert('');
		
		if(address==''||amount==0||amount==''||password==''||!wallet.web3.isAddress(address)||address==storage.address) {
			if(!wallet.web3.isAddress(address))	modal.alert('<div class="alert alert-warning" role="alert">Address is wrong</div>');
			else if(address=='')				modal.alert('<div class="alert alert-warning" role="alert">Address is empty</div>');
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
									modal.alert('<div class="alert alert-warning" role="alert">Transaction is pending : <br/><small><a target="_blank" href="'+CONFIG['network']['href']+'/tx/'+storage.tx+'">'+storage.tx+'</a></small></div>');
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
	},
	this.sendTransaction		= function(address,password,amount,data=null,gasLimit=4700000) {
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
							let txParams	= {	'nonce'		:	wallet.web3.toHex(parseInt(t)),
												'gasPrice'	:	gasPrice, 
												'gasLimit'	:	wallet.web3.toHex(gasLimit),
												'to'		:	address, 
												'value'		:	wallet.web3.toHex(wallet.web3.toWei(amount, 'ether'))};
							if(data!=null)
								txParams['data']	= data;
							let tx	= new ethereumjs.Tx(txParams);
							tx.sign(new ethereumjs.Buffer.Buffer(privateKey, 'hex'));
							wallet.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(e,r) {if(e) modal.alert('<div class="alert alert-warning" role="alert">Transaction Fail ('+e.message+')</div>'); else {modal.alert('<div class="alert alert-warning" role="alert">Success <small>(<a target="_blank" href="'+CONFIG['network']['href']+'/tx/'+r+'">'+r+'</a>)</small><div>');storage.tx=r;}});
						}
					});
				}
			});
			return true;
		}
		return false;
	},
	// deposit & withdrawal
	
	// history
	this.history			= function() {
		wallet.updateTimer(true);
		modal.update('Transaction History',"Now Loading");

		let jsonUrl	= CONFIG['network']['api']+"/api?module=account&action=txlist&address="+storage.address+"&startblock=0&endblock=latest&sort=desc";
		$.getJSON(jsonUrl,function(data) {
			if(data["result"].length==0)
				modal.update('Transaction History',data["message"]);
			else {
					let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";
					
					for(i=0;i<data["result"].length;i++){
						let date	= new Date(data["result"][i]["timeStamp"]*1000);
						let tx		= '<a target="_blank" href="'+CONFIG['network']['href']+'/tx/' + data["result"][i]["hash"] + '">'+data["result"][i]["hash"]+'</a>';
						let from	= '<a target="_blank" href="'+CONFIG['network']['href']+'/address/' + data["result"][i]["from"] + '">'+data["result"][i]["from"]+'</a>'; 
						let to		= '<a target="_blank" href="'+CONFIG['network']['href']+'/address/' + data["result"][i]["to"] + '">'+data["result"][i]["to"]+'</a>';
						let value	= wallet.web3.fromWei(data["result"][i]["value"],'ether');
						let status	= data["result"][i]["txreceipt_status"]==0?"<div class='text-danger'><small>[CANCELLED]</small></div>":"";

						//let gas		= data["result"][i]["gas"];
						//let gasPrice	= data["result"][i]["gasPrice"];
						//let gasUsed	= data["result"][i]["gasUsed"];
						//let input	= data["result"][i]["input"];						
						//value *= (data["result"][i]["from"]==storage.address)?-1:1;
						//table	+="<tr><td><div><h6>"+date+"</h6></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>Tx : "+tx+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>From : "+from+"</small></div><div style='width:320; text-overflow:ellipsis; overflow:hidden; white-space:nowrap'><small>To : "+to+"</small></div></td><td align='right'>"+value+" ETH</td></tr>";
						
						if(data["result"][i]["from"]==storage.address) {
							value *= -1;
							table	+="<tr><td><div><h6>"+date+"</h6></div><div class='d-inline-block text-truncate' style='max-width: 320px;'><small>Tx : "+tx+"</small></div><div class='d-inline-block text-truncate' style='max-width: 320px;'><small>To : "+to+"</small></div></td><td class='align-middle text-right'>"+status+value+" ETH</td></tr>";
						} else {
							table	+="<tr><td><div><h6>"+date+"</h6></div><div class='d-inline-block text-truncate' style='max-width: 320px;'><small>Tx : "+tx+"</small></div><div class='d-inline-block text-truncate' style='max-width: 320px;'><small>From : "+from+"</small></div></td><td class='align-middle text-right'>"+status+value+" ETH</td></tr>";
						}
					}
					table		+= "</tbody></table></div>";
					modal.update('Transaction History',table);
				}			
			});
	}
	// history
}

let modal	= new function() {
	this.update	= function(title, body, foot='', alert=''){
		let dismiss	= '<button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>';
		$('#modalTitle').html(title);
		$('#modalAlert').html(alert);
		$('#modalBody').html(body);
		$('#modalFooter').html(foot===''?dismiss:'<button type="button" class="btn btn-primary" onClick="script:'+foot+'">Confirm</button>'+dismiss);
	},
	this.alert	= function(alert=''){
		$('#modalAlert').html(alert);
	}		
}

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
	this.getLottoMaxMarkCol= function(game){
		let max		= 0;
		let mark	= 0;
		let col		= 0;
		switch(game) {
		case 'lotto953': max=9;	mark=5;col=6;break;
		case 'lotto645': max=45;mark=6;col=3;break;
		}
		return {'max':max,'mark':mark,'col':col};
	},
	this.getNumCircle	= function(num,opacity=1,isRed=false) {
		if(isRed)
			return '<a class="numberCircle2" style="opacity: '+opacity+';">'+num+'</a>';
		return '<a class="numberCircle1" style="opacity: '+opacity+';">'+num+'</a>';
	},
	this.isGameAddress	= function(game,address){
		for(let i=0;i<CONFIG[game]['address'].length;i++)
			if(CONFIG[game]['address'][i]==address)
				return true;
		return false;
	}
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
		let blue	= "<i class='material-icons' style='font-size:16px;color:blue'>brightness_1</i>";
		let green	= "<i class='material-icons' style='font-size:16px;color:green'>brightness_1</i>";

		let x1		= 0;
		let x2		= 0;
		let y		= 0;
		let b		= -1;

		$('#rnd_'+game+'_'+address).html("Round "+data[0][0].toNumber()+"-"+data[0][1].toNumber()+'<small> ('+util.getGameState(parseInt(data[1]))+')</small>');

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
	},
	this.updateInfo		= function(game,address,data) {
		wallet.updateTimer(true);

		let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";

		table		+='<tr><td>Contract</td><td><a style="cursor:hand" onClick="window.open(\''+CONFIG['network']['href']+'/address/'+address+'\',\'_blank\')"><small>'+address+"</small></td></tr>";

		switch(game){
		case 'lotto953':
		case 'lotto645':
			table	+="<tr><td>Round</td><td>"+data[0]+" <small>("+util.getGameState(parseInt(data[1]))+")</small></td></tr>";
			table	+="<tr><td>Price</td><td>"+wallet.web3.fromWei(data['cost'][1])+" ETH</td></tr>";
			table	+="<tr><td>Balance</td><td>"+wallet.web3.fromWei(data['cost'][0])+" ETH</td></tr>";
			table	+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(data['cost'][2])+" ETH</td></tr>";
			table	+="<tr><td>Pending transfer</td><td>"+data['cost'][3]+" remains</td></tr>";
			if(data[3].length>0) {
				table	+="<tr><td colspan='2'>My tickets</td></tr>";
				for(let i = 0 ; i < data[3].length ; i++) {
					let num		= data[3][i].toString(2);
					let ticket	='';
					for(let j=num.length-1,k=1;j>=0;j--,k++)
						ticket	+= num[j]=='1'?'<a class="numberCircle1">'+k+'</a>':'';
					table	+="<tr><td colspan='2'>"+ticket+"</td></tr>";
				}
			}
			break;
		default:
			table	+="<tr><td>Round</td><td>"+data[0][0] +"-" + data[0][1] +" <small>("+util.getGameState(parseInt(data[1]))+")</small></td></tr>";
			table	+="<tr><td>Bet</td><td>"+wallet.web3.fromWei(data['cost'][1])+" ETH</td></tr>";
			table	+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(data['cost'][2])+" ETH</td></tr>";
			table	+="<tr><td>Pending transfer</td><td>"+data['cost'][3]+" remains</td></tr>";
			break;
		}
		
		table		+="</tbody></table></div>";
		modal.update(CONFIG[game]['name'],table);
	}
}