const NETWORK	= {	'isMainNet'	:	false,
					'name'		:	'Ropsten Test Network',
					'provider'	:	'https://ropsten.infura.io',//'https://api.myetherapi.com/rop',
					'ethscan'	:	'https://ropsten.etherscan.io',
					//isMainNet	:	true,
					//name		:	'Main Ethereum Network',
					///provider	:	'https://mainnet.infura.io',//'https://api.myetherapi.com/eth'
					//ethscan		:	'https://api.etherscan.io',
				};

const iCont		= '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADrSURBVEhL7ZUxCsJQDIYLLq4eRHASNx0dXQRxFbyCHbQZK30JHkPo6OotvJCmz9RqB5tQLBX6wT+F/H+T1/YFHf8DICI4Sl9KaC0lNeyx+PBgTykVgMMbIN1zRY5iKalh4/DdI/OUUkERhBfWEYjmUlIDzs18r/eoCpKVQXIaccPWJKLxs5fW+qDyGhTK120LcrSKEK8mOdr4XktQHWwTAfTDOB580zJNe765hC1IcUZ7oqFvLtHSoKZWVwfbRE293s19sL/+BfEKzvxkuwPRVEpqOGiS9WYe1ROJ8jVY4KkU10RTF19HSwmCB/pHPUpKrAv7AAAAAElFTkSuQmCC">';
const iCard		= '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKbSURBVEhL3VZPqExxFH6FDSKKLKzYUdhIWUhhYcfiEbFRbKQe0hvezP2RxZvu75zL1BOzRxpiqUSSPyFFVjbCQhYWeuol/33nzJl7Z35z78y87N5Xp5n73fOd7/z+zgzNbJSTZLXzfNkRP0e86BWR58eOqHSoXp9j8sEgJhHxNxT5O52A4S2XJCusTH/YSCCkZxHRnoh5uFcgv+w8/UkNiT8hrruYR5z3q6xsN1D8pYqY9xnVF5i6Ny2jjpAG0PhwozHLUjPg5WtNinmvUSlQcKNz9bn2mKJNM1KJeSfyCPEEI/stfOT9UUvNUGQkz3j3AwUelcbHFxmtKNJgdsbUiPi+URnyRFHMB8Gn64Dvr0ar1YX2urg5omMDG1WItoD7lZq0wvPd1twXGnm6YbnnjcrQLjpZqy3B7vuSFg8CU3Mm1GgRg+xA5X2yy6gM7SIMvdQqmhdoYtI5NzvPaCyOV6a51epyozMERqfS5JzAiKaKjLDT9muOp3dGdaLDyPul+P5en8PA5sBtcCLUaBEA3CXh0MwVozoRilyttkDOht4Eei7oJsS7XXxunQqAAiPlkHvYqE7kiQTpVvX8ObxAQ41s/dZhLTOv1aQQhUZxvMbFyVaJ497PM1oRaireb282RZO514+gyKgXQg2m66w+e76jCXlAgvwGYcHpgFF9gc7fmmaHPhPfM6NIE/KAbi5KEj4/IPE01mS0VyDnWjOff8p5ke0O7ZRwuFW2WdluYC2WQfSx2eHggeJO9Fif9crJtTUxMV+LFgG/RYsxDSV0exXR0CB+CjFu724TxFcYXZDpRpMPhMNoH1q56UN2Gw7xZhhHWJfbYtBmlgbMviNvk8n+H7J15eBiNEd09PKHBTc2pm+Dpcx4DA39A6rv/PETCdbqAAAAAElFTkSuQmCC">';
const iInfo		= '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEhSURBVEhL7ZVBSgNBEEUHFAQ3SrZ6C4+gV8jGK4jrgGAXuGrSVQmzjHqCyUVcuJBszR08glY133S0QYbpGVHxwSeVmuG/0CGZ6u9CIiMX5I5YHvuIdi1oPj9EfYKY7/WG137Dt6hPUOAnu+iYaycyLop2RJF2oj6hy1W8OJVzrDpjHRCtsEq0EV3W9Z6e/cRiM9YZxaKJ9wfxHo3NWGcUi4gW+xSkidEZ64weRLRL09lZjM5YZxSLvu3o/kU/XzRump1r5hOLzVhnFIva0lpkn3jzw+wSlofYpa+oT2xELDMX+AVzUfRf/AL1iS3Re9b6PPGdEuRGT+UU1R/5JFqT98e41C9bouEkhon0u3keVGI4luWVyBHeDsdXz5dfRFW9AdUDRg/25r2SAAAAAElFTkSuQmCC">';

let storage	= new function() {
	this.wallet		= '';
	this.address		= '';
	this.tx			= '';
	this.time		= 0;
	this.load		= function() {
		if(!storage.hasData())
			return;
		let data	= JSON.parse(localStorage[NETWORK['provider']]);
		storage.wallet	= data.wallet;
		storage.address	= data.address;
		storage.time		= data.time;
	};
	this.save		= function() {
		localStorage[NETWORK['provider']] = storage.wallet!=''?JSON.stringify({'wallet':storage.wallet,'address':storage.address,'tx':storage.tx,'time':storage.time}):'';
	};
	this.hasData		= function() {
		return (typeof localStorage[NETWORK['provider']] !== 'undefined' && localStorage[NETWORK['provider']] != '');
	};
	this.hasStorage	= function() {
		return (typeof(Storage) !== "undefined");
	};
	this.clear		= function() {
		storage.wallet	= '';
		storage.address	= '';
		storage.tx		= '';
		localStorage.removeItem(NETWORK['provider']);
	};
	this.reset		= function() {
		storage.address	= '';
		storage.time		= 0;
	};
}

let abi		= new function() {
	this.contents	= [	{	'name':'Baccarat', 
							'abi':[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"openCards","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_seed","type":"uint256"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerDepositWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bankerReserve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"transferFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_slot","type":"uint8"},{"name":"_multi","type":"uint8"}],"name":"bet","outputs":[{"name":"","type":"address[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"information","outputs":[{"name":"","type":"uint256[3]"},{"name":"","type":"uint8"},{"name":"","type":"uint64[]"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"int256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankersWithdrawlFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256[3]"},{"indexed":false,"name":"","type":"uint8"},{"indexed":false,"name":"","type":"uint64[]"},{"indexed":false,"name":"","type":"uint64"}],"name":"eventUpdate","type":"event"}],
							'address':['0x1d1a04cffdf438bb7133e4464ec78fc24596d7d0'],
							'contracts':{},
							'informations':{}},
						{	'name':'Dragon Tiger',
							'abi':[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"openCards","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_seed","type":"uint256"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerDepositWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bankerReserve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"transferFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_slot","type":"uint8"},{"name":"_multi","type":"uint8"}],"name":"bet","outputs":[{"name":"","type":"address[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"information","outputs":[{"name":"","type":"uint256[3]"},{"name":"","type":"uint8"},{"name":"","type":"uint64[]"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"int256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankersWithdrawlFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256[3]"},{"indexed":false,"name":"","type":"uint8"},{"indexed":false,"name":"","type":"uint64[]"},{"indexed":false,"name":"","type":"uint64"}],"name":"eventUpdate","type":"event"}],
							'address':['0x19606e126faf5826d8248006b535a983dea08dd9'],
							'contracts':{},
							'informations':{}},
						{	'name':'High Low',
							'abi':[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"openCards","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_seed","type":"uint256"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerDepositWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bankerReserve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"transferFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankerMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_slot","type":"uint8"},{"name":"_multi","type":"uint8"}],"name":"bet","outputs":[{"name":"","type":"address[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"information","outputs":[{"name":"","type":"uint256[3]"},{"name":"","type":"uint8"},{"name":"","type":"uint64[]"},{"name":"","type":"uint64"},{"name":"","type":"uint256"},{"name":"","type":"int256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bankersWithdrawlFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256[3]"},{"indexed":false,"name":"","type":"uint8"},{"indexed":false,"name":"","type":"uint64[]"},{"indexed":false,"name":"","type":"uint64"}],"name":"eventUpdate","type":"event"}],
							'address':['0x9fcef30a4a12d9aea2765b72768a515ccb79431a'],
							'contracts':{},
							'informations':{}},
						{	'name':'Lotto 953', 
							'abi':[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setTicketPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tickets","type":"uint128[]"}],"name":"buy","outputs":[{"name":"","type":"uint128[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_seed","type":"uint256"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transferFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"information","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint128[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"uint8"},{"indexed":false,"name":"","type":"uint256[]"}],"name":"eventUpdate","type":"event"}],
							'address':['0xe327cc5b39cdfdaf1fdbc3b005a4f3e1ed0e308b'],
							'contracts':{},
							'informations':{}}];
	this.transaction	= null;
	this.start				= function() {
		for(let i=0;i<abi.contents.length;i++)
			if(wallet.web3!=null)
				for(let j=0;j<abi.contents[i].address.length;j++)
					abi.contents[i].contracts[abi.contents[i].address[j]]			= wallet.web3.eth.contract(abi.contents[i].abi).at(abi.contents[i].address[j]);
			else
				abi.contents[i].contracts = {};
		abi.transaction	= null;
	};
	this.isValidate			= function(game,contract) {
		for(let i=0;i<abi.contents.length;i++)
			for(let j=0;j<abi.contents[i].address.length;j++)
				if(game==i&&contract==abi.contents[i].address)
					return true;
		return false;
	};
	this.getABI				= function(game,contract) {
		$.getJSON(NETWORK['.ethscan']+'/api?module=contract&action=getabi&address='+NETWORK['contract'], function (game,contract,data) {
		    let temp = JSON.parse(data.result);
		    if (temp != '')
		    		abi.contents[game].contracts[contract]	= wallet.web3.eth.contract(temp).at(contract);
		});
	};
	this.makeUpdateEvent		= function(game,contract) {
		abi.contents[game].contracts[contract].eventUpdate(function(e,r){abi.information(game,contract,function(_game,_contract,_data){page.updateContents(_game,_contract,_data);});});
	};
	this.makeTransaction		= function(game,contract,password) {
		abi.transaction	= function(data,callback) {
			if(storage.address==''||abi.contents[game].contracts[contract]==null)
				return;
			wallet.sendTransaction(contract,password,parseFloat(wallet.web3.fromWei(abi.contents[game].informations[contract][3],'ether')),data);
		}
	};
	this.bet			= function(game,contract,slot,callback) {
		if(abi.contents[game].contracts[contract]!=null&&abi.transaction!=null&&game<3)
			abi.transaction(ethereumjs.Util.bufferToHex(ethereumjs.ABI.simpleEncode("bet(uint8)", slot)),callback);
	};
	this.buy			= function(game,contract,tickes,callback) {
		if(abi.contents[game].contracts[contract]!=null&&abi.transaction!=null&&game==3)
			abi.transaction(ethereumjs.Util.bufferToHex(ethereumjs.ABI.simpleEncode("buy(uint128[])", tickes)),callback);
	};
	this.information	= function(game,contract,callback) {
		if(abi.contents[game].contracts[contract]!=null)
			abi.contents[game].contracts[contract].information(function(e,r){if (!e){abi.contents[game].informations[contract]=r;callback(game,contract,r);}});
	};
}

let wallet	= new function() {
	this.web3			= null;
	this.ETH				= 0;
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
		else if(storage.hasData()) {
			storage.load();
			wallet.state();
			wallet.updateTimer(true);
		} else {
			storage.wallet	= '';
			storage.reset();
			storage.save();
		}

		const engine		= ZeroClientProvider({getAccounts: function(){},rpcUrl:NETWORK['provider']});
		wallet.web3		= new Web3(engine);
		wallet.showEthNetwork();
		
		abi.start();
		page.start();

		engine.on('block', wallet.updateBlock);
	};
	this.updateBlock		= function(block) {
		wallet.updateTimer(false);
		
		let tempState	= wallet.state();
		if(tempState==2)
			wallet.updateBalance(function(balance){wallet.ETH=balance;$('#walletBalance').html(wallet.ETH+' e');});
		else
			$('#walletBalance').html('');

		wallet.update();
		page.update();

		wallet.stateBackup	= tempState;	
	};
	this.updateTimer		= function(update) {
		let time = new Date().getTime();
		if(wallet.state()!=2)
			return;
		if(time > parseInt(storage.time) + wallet.timer) {
			storage.reset();
			page.enter();
		} else if(update)
			storage.time	= time;
		storage.save();
	};
	this.update			= function() {
		switch(wallet.state())
		{
			case 0:
				$('#walletBalance').html('');
				$('#mainNavWallet').html('');
				$('#mainNavAccount').html(	'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletCreate()">Create</a>'+
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletRestore()">Restore</a>' );					
				break;
			case 1:
				$('#walletBalance').html('');
				$('#mainNavWallet').html('');
				$('#mainNavAccount').html(	'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.logIn()">Login</a>' );					
				break;
			case 2:
				wallet.web3.eth.defaultAccount		= storage.address;
				wallet.web3.settings.defaultAccount	= storage.address;				
				wallet.updateBalance(function(balance){wallet.ETH=balance;$('#walletBalance').html(wallet.ETH+' e');});
				$('#mainNavWallet').html(	'<li class="nav-item dropdown">' +
											'<a class="nav-link dropdown-toggle" style="cursor:hand" id="navbarDropdownMenuWallet" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons">account_balance_wallet</i></a>'+
											'<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuWallet" id="mainNavWallet">'+
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.bankRoller()">Bank Roller</a>' +
											'<div class="dropdown-divider"></div>' +
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletDeposit()">Deposit</a>' +
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletWithrawal()">Withrawal</a>' +
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletHistory()">History</a>' +
											'</div></li>');
				$('#mainNavAccount').html(	'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletExport()">Export</a>' +
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.walletDestroy()">Destroy</a>' +
											'<div class="dropdown-divider"></div>' +
											'<a class="dropdown-item" style="cursor:hand" data-toggle="modal" data-target="#modalDialog" onClick="script:wallet.logOut()">Logout</a>' );
				break;
		}
	};
	this.updateBalance			= function(callback) {
		wallet.web3.eth.getBalance(storage.address, function(e,r){if (!e) callback(web3.fromWei(r.toNumber(),'ether'));});
	};
	this.walletCreate	= function() {
		if(!storage.hasStorage()) {
			page.modalUpdate('Create Fail','This browser is not support storage!');
			return;
		}

		let body			=	'<div style="overflow-x:auto;">' +
							'<center>Create wallet from <b>' + NETWORK.name + '</b></center>' +
							'<center>Wallet data in your computer only.</center>' +
							'<center>If you clean up your browser. Be removed wallet data permanently too.</center><br/>' +
							'<div class="input-group"><input id="pssword1" type="password" class="form-control" placeholder="Password (Over 8 letters)" aria-label="password" aria-describedby="pssword1"></div><br>' +
							'<div class="input-group"><input id="pssword2" type="password" class="form-control" placeholder="Password retype" aria-label="password retype" aria-describedby="pssword2">' +
							'</div></div>';
		page.modalUpdate('Create',body,'wallet.walletCreateOK()');
		page.modalAlert('<div class="alert alert-danger font-weight-bold" role="alert"><center>Don\'t forget your password. And must backup your wallet.</center></div>');
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
	this.walletCreateOK	= function() {
		let p1	= $('#pssword1').val();
		let p2	= $('#pssword2').val();

		if(p1===p2 && p1.length > 7) {
			let dk				= keythereum.create();
			let keyObject		= keythereum.dump(p1, dk.privateKey, dk.salt, dk.iv);
			keyObject.isMainNet	= NETWORK.isMainNet;
			storage.wallet		= JSON.stringify(keyObject);
			storage.reset();
			storage.save();
			
			wallet.update();
			page.update();
			page.modalUpdate('Create','Success create your new account.');
			page.modalAlert('<div class="alert alert-danger font-weight-bold" role="alert"><center>Don\'t forget your password. And must backup your wallet.</center></div>');
		} else {
			if(p1!=p2) {
				page.modalAlert('<div class="alert alert-warning" role="alert">Retype password is not same</div>');
			} else {
				page.modalAlert('<div class="alert alert-warning" role="alert">Too short password</div>');
			}
		}
	}
	this.walletRestore	= function() {
		if(!storage.hasStorage()) {
			page.modalUpdate('Restore Fail','This browser is not support storage!');
			return;
		}

		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><input id="restore-string" type="text" class="form-control" placeholder="Backup string" aria-label="Backup string" aria-describedby="restore-string"></div><br>' +
							'<div class="input-group"><input id="restore-password" type="password" class="form-control" placeholder="Password" aria-label="Restore password" aria-describedby="restore-password"></div>' +
							'</div>';		
		page.modalUpdate('Restore',body,'wallet.walletRestoreOK()');
	};
	this.walletRestoreOK	= function() {
		let password		= $('#restore-password').val();
		let keyObject	= JSON.parse($('#restore-string').val());
		
		try {
			let privateKey		= keythereum.recover(password, keyObject);
			storage.wallet		= JSON.stringify(keyObject);
			storage.reset();
			storage.save();
			page.modalUpdate('Restore','Restore wallet complete');
		} catch (e) {
			if(password!=''&&restore!='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else if(restore=='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Restore string is empty</div>');
			else if(password=='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Restore password is empty</div>');			
		}
	};
	this.walletDestroy	= function() {
		let body			=	'<p class="text-danger">Destroy Wallet.</p>' +
							'<div style="overflow-x:auto;">' +
							'<div class="input-group"><input id="destory-password" type="password" class="form-control" placeholder="Password" aria-label="destory password" aria-describedby="destory-password"></div>' +
							'</div>';		
		page.modalUpdate('Destory',body,'wallet.walletDestroyOK()');
	};
	this.walletDestroyOK	= function() {
		let password		= $('#destory-password').val();

		try {
			keythereum.recover(password, JSON.parse(storage.wallet));
			storage.clear();
			wallet.logOutOK();
			page.modalUpdate('Destory','Destory wallet complete');
		} catch (e) {
			if(password!='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is empty</div>');			
		}
	};
	this.walletExport	= function() {
		wallet.updateTimer(true);
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><input id="export-password" type="password" class="form-control" placeholder="Password" aria-label="Export password" aria-describedby="export-password"></div>' +
							'</div>';		
		page.modalUpdate('Export Wallet',body,'wallet.walletExportOK()');
	};
	this.walletExportOK	= function() {
		let password		= $('#export-password').val();
		
		try {
			let privateKey		= keythereum.recover(password, JSON.parse(storage.wallet));
			page.modalUpdate('Export Wallet','<div style="overflow-x:auto;"><small>'+storage.wallet+'</small></div>');
		} catch (e) {
			if(re=='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is empty</div>');
			else
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong</div>');			
		}
	};
	this.walletDeposit			= function() {
		wallet.updateTimer(true);
		let body	= '<div align="center"><p class="text-warning">!! WARNING! THIS NETWORK IS '+NETWORK.name+' !!</p></div>';
		body		+="<div align='center'><img src='https://api.qrserver.com/v1/create-qr-code/?data="+storage.address+"&size=256x256 alt='' width='256' height='256'/></div><br/>";
		body		+="<div align='center'><a class='text-primary' target='_blank' href='"+NETWORK.ethscan+"/address/"+storage.address+"'>"+storage.address+"</a></div>";
		page.modalUpdate('Deposit',body);
	};
	this.walletWithrawal			= function() {
		wallet.updateTimer(true);
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><input id="withrawal-address" type="text" class="form-control" placeholder="Withrawal Address" aria-label="Withrawal Address" aria-describedby="withrawal-address"></div><br>' +
							'<div class="input-group"><input id="withrawal-amount" type="number" step="any" class="form-control" placeholder="Withrawal Amount" aria-label="Withrawal Amount" aria-describedby="withrawal-amount"></div><br>' +
							'<div class="input-group"><input id="withrawal-password" type="password" class="form-control" placeholder="Password" aria-label="Withrawal Password" aria-describedby="withrawal-password"></div>' +
							'</div>';
		page.modalUpdate('Withrawal',body,'wallet.walletWithrawalOK()');
	};
	this.walletWithrawalOK		= function() {
		let address		= $('#withrawal-address').val();
		let amount		= $('#withrawal-amount').val();
		let password		= $('#withrawal-password').val();
		
		if(address==''||amount==0||amount==''||password==''||!wallet.web3.isAddress(address)||address==storage.address) {
			if(!wallet.web3.isAddress(address))	page.modalAlert('<div class="alert alert-warning" role="alert">Address is wrong</div>');
			else if(address=='')					page.modalAlert('<div class="alert alert-warning" role="alert">Address is empty</div>');
			else if(amount==0||amount=='')		page.modalAlert('<div class="alert alert-warning" role="alert">Withrawal is zero</div>');
			else if(password=='')				page.modalAlert('<div class="alert alert-warning" role="alert">Passward is empty</div>');
			else if(address==storage.address)	page.modalAlert('<div class="alert alert-warning" role="alert">This is your address</div>');
		} else {
			wallet.updateBalance(function(balance){
				if(balance>parseInt(amount)) {
					if(storage.tx != '') {
						wallet.web3.eth.getTransaction(storage.tx,function(e,r){
							if(!e)
								if(r.blockNumber==null || parseInt(r.blockHash) == 0) 
									page.modalAlert('<div class="alert alert-warning" role="alert">Transaction is pending : <br/><small><a target="_blank" href="'+NETWORK.ethscan+'/tx/'+storage.tx+'">'+storage.tx+'</a></small></div>');
								else {
									storage.tx	= '';
									storage.save();
									if(!wallet.sendTransaction(address,password,amount))
										page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong</div>');									
								}
							else
								page.modalAlert('<div class="alert alert-warning" role="alert">Transaction fail</div>');
						});
					} else {
						if(!wallet.sendTransaction(address,password,amount))
							page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong</div>');
					}
				} else {
					page.modalAlert('<div class="alert alert-warning" role="alert">Amount is too big. Less then '+balance+' Eth</div>');
				}
			});
		}
	};
	this.sendTransaction		= function(address,password,amount,data=null,gasLimit=21000) {
		let privateKey	= wallet.getPrivateKeyString(password);

		if(privateKey!=null) {
			wallet.web3.eth.getGasPrice(function(e,r){
				if(e!=null) {
					page.modalAlert('<div class="alert alert-warning" role="alert">Network error - getGasPrice</div>');
				} else {
					let gasPrice = wallet.web3.toHex(r.toNumber());
					wallet.web3.eth.getTransactionCount(storage.address,function(e,t){
						if(e!=null) {
							page.modalAlert('<div class="alert alert-warning" role="alert">Network error - getTransactionCount</div>');
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
							wallet.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(e,r) {if(e) page.modalUpdate('Withrawal Fail',e); else {page.modalUpdate('Withrawal Success','<small><a target="_blank" href="'+NETWORK.ethscan+'/tx/'+r+'">'+r+'</a></small>');storage.tx=r;}});
						}
					});
				}
			});
			return true;
		}
		return false;
	};
	this.walletHistory			= function() {
		wallet.updateTimer(true);
		page.modalUpdate('Transaction History',"Now Loading");
		
		let jsonUrl	= NETWORK.ethscan+"/api?module=account&action=txlist&address="+storage.address+"&startblock=0&endblock=latest";		
		$.getJSON(jsonUrl,function(data) {
			if(data["result"].length==0)
				page.modalUpdate('Transaction History',data["message"]);
			else {
					let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";
					
					for(i=data["result"].length-1;i>=0;i--){
						let date		= new Date(data["result"][i]["timeStamp"]*1000);
						let tx		= '<a target="_blank" href="'+NETWORK.ethscan+'/tx/' + data["result"][i]["hash"] + '">'+data["result"][i]["hash"]+'</a>';
						let from		= '<a target="_blank" href="'+NETWORK.ethscan+'/address/' + data["result"][i]["from"] + '">'+data["result"][i]["from"]+'</a>'; 
						let to		= '<a target="_blank" href="'+NETWORK.ethscan+'/address/' + data["result"][i]["to"] + '">'+data["result"][i]["to"]+'</a>';
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
					page.modalUpdate('Transaction History',table);
				}			
			});
	};
	this.logIn			= function() {
		let body			=	'<div style="overflow-x:auto;">' +
							'<div class="input-group"><input id="login-password" type="password" class="form-control" placeholder="Password" aria-label="login password" aria-describedby="login-password"></div>' +
							'</div>';		
		page.modalUpdate('Login',body,'wallet.logInOK()');
	};
	this.logInOK			= function() {
		let password		= $('#login-password').val();
		
		try {
			keythereum.recover(password, JSON.parse(storage.wallet));
			wallet.loginWithPK();
		} catch (e) {
			if(password!='')
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is wrong.</div>');
			else
				page.modalAlert('<div class="alert alert-warning" role="alert">Password is empty</div>');			
		}
	}
	this.loginWithPK		= function() {
		wallet.web3.version.getNetwork((e, r) => {
				let data	= JSON.parse(storage.wallet);
				if((r==1&&data.isMainNet)||(r==3&&!data.isMainNet)) {
					wallet.web3.eth.defaultAccount			= '0x'+data.address;
					wallet.web3.settings.defaultAccount		= '0x'+data.address;
					
					storage.reset();
					storage.address	= '0x'+data.address;
					storage.time		= new Date().getTime();
					storage.save();
					
					wallet.update();
					page.update();
					page.modalUpdate('Login','Login Success');
				} else  {
					page.modalUpdate('Login','Login Fail');
					return;					
				}
			});
	};
	this.logOut			= function() {
		page.modalUpdate('Logout','Are you sure?','wallet.logOutOK()');
	};
	this.logOutOK			= function() {
		wallet.web3			= null;
		storage.reset();
		storage.save();

		page.modalUpdate('Logout','See you next time.');
		wallet.start();
		if(page.parameter['game']!=-1||page.parameter['contract']!='')
			setTimeout(function(){page.enter();},2000);
	};
	this.bankRoller				= function() {
		page.modalUpdate('Bank Roller','Loading....');
		// todo : get bankroller informaion
	};
	this.bankRollerOpen			= function() {
		// todo : create table with game/address
	};
	this.bankRollerOpenOK		= function(){
		
	};
	this.bankRollerEdit			= function() {
		// todo : edit table data
		// todo : display game/address/balance, deposit, close table
		let body			=	'<div style="overflow-x:auto;">' +
							'<div id="bankroller-game">Baccarat (CH-3)</div>' +
							'<div class="input-group"><span class="input-group-addon">Balance</span><input id="bankroller-balance" type="number" step="any" class="form-control bg-white" aria-label="bankroller balance" aria-describedby="bankroller-balance" readonly></div><br>' +
							'<div class="input-group"><span class="input-group-addon">Deposit</span><input id="bankroller-deposit" type="number" step="any" class="form-control bg-white" aria-label="bankroller deposit" aria-describedby="bankroller-deposit"><span class="input-group-btn"><button class="btn btn-secondary" type="button">Transfer</button></span></div><br>' +
							'<div class="input-group"><input id="login-password" type="password" class="form-control" placeholder="Password" aria-label="login password" aria-describedby="login-password"></div>' +
							'</div>';
		page.modalUpdate('Bank Roller',body);
	};
	this.bankRollerEditDeposit	= function() {
	}
	this.bankRollerEditClose	= function() {
	}
};

let page		= new function() {
	this.historyRow		= 6;
	this.historyCol		= 140;
	this.casinoGame		= null;
	this.parameter		= {'game':-1,'contract':''};
	this.modalUpdate					= function(title, body, foot='', alert=''){
		$('#modalTitle').html(title);
		$('#modalAlert').html(alert);
		$('#modalBody').html(body);
		$('#modalFooter').html(foot===''?'<button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>':'<button type="button" class="btn btn-primary" onClick="script:'+foot+'">Confirm</button><button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>');
	};
	this.modalAlert					= function(alert=''){
		$('#modalAlert').html(alert);
	};	
	this.start			= function () {
		let url = new URL(location.href);
		let g = parseInt(url.searchParams.get("g"));
		let c = url.searchParams.get("c");

		if(g!=null,c!=null)
			page.parameter	= {'game':g,'contract':c}; 
			
		if(abi.isValidate(g,c))
			page.game();
		else if(page.parameter['game']==-1 || page.parameter['contract']=='')
			page.front();
		else {
			$('#top-alert').html('<div class="alert alert-warning" role="alert">Invidate parameters move to top page</div>');
			setTimeout(function(){page.enter();},2000);			
		}
		page.resize();
	};
	this.update			= function () {
		if(page.parameter['game']==-1 || page.parameter['contract']=='') {
			for(let i=0 ; i < abi.contents.length ; i++)
				for(let j=0 ; j < abi.contents[i].address.length; j++) {
					let address = abi.contents[i].address[j];
					abi.information(i,address,function(_game,_contract,_data){page.updateContents(_game,_contract,_data);});
					if(wallet.state()==2)
						$('#infobtn_'+i+'_'+address).html('<button data-toggle="modal" data-target="#modalDialog" type="button" class="btn btn-primary btn-sm text-secondary" onClick="page.information('+i+',\''+address+'\')">'+iInfo+'</button><button type="button" class="btn btn-primary btn-sm text-secondary" onClick="script:page.enter('+i+',\''+address+'\')">'+iCard+'</button>');
					else
						$('#infobtn_'+i+'_'+address).html('<button type="button" class="btn btn-primary btn-sm text-secondary" onClick="window.open(\''+NETWORK.ethscan+'/address/'+address+'\',\'_blank\')">'+iCont+'</button>');
				}
		} else {
			abi.information(page.parameter['game'],page.parameter['contract'],function(_game,_contract,_data){page.updateContents(_game,_contract,_data);});
		}
	};
	this.enter			= function (game=-1,contract='') {
		storage.save();
		if(wallet.state()!=2 || (game==-1||contract==''))
			location.href	= location.origin;
		else
			location.href	= location.origin+'/?g='+game+'&c='+contract;
	};
	// front page
	this.front		= function () {
		let body	= '<br/>';
		
		body		+= page.topContentsLotto(3);
		body		+= "<p/>";
		body		+= page.topContents(0);
		body		+= "<p/>";
		body		+= page.topContents(1);
		body		+= "<p/>";
		body		+= page.topContents(2);

		$('#contentsBody').html(body	+'<br/>');
	};
	this.topContentsLotto	= function (game) {
		let body		= '<div class="card bg-light"><div class="card-body">';
		body			+='<div class="row" id="lottoTop">';
		body			+='<div class="col-md-2 panel"><h4 class="card-title font-weight-bold">'+abi.contents[game].name+'</h4> Lotto953 is ......</div>';
		
		for(let i=0 ; i < 5 ; i++) {
			if(i==0)
				body		+='<div class="col-md-2 panel" id="lottoStat_'+i+'""><div>Statistics</div><div class="card-text"><table class="border border-secondary" style="width:100%;border-collapse: collapse;">';
			else
				body		+='<div class="col-md-2 panel" id="lottoStat_'+i+'"><div id="lottoRoundT_'+i+'"></div><div id="lottoRound_'+i+'">Round</div><div class="card-text"><table class="border border-secondary" style="width:100%;border-collapse: collapse;">';
			for(let j=0 ; j < 3 ; j++) {
				body+='<tr>';
				for(let k=0 ; k < 3 ; k++)
					if((j*3+k)%2==0)
						body+="<td style='align-middle width:33%;' bgcolor='#DEDEDE'><div align='center' valign='middle' id='lotto_"+i+"_"+(j*3+k)+"'>&nbsp</div></td>";
					else
						body+="<td style='align-middle width:33%;' class='bg-light'><div align='center' valign='middle' id='lotto_"+i+"_"+(j*3+k)+"'>&nbsp</div></td>";
				body+='</tr>';
			}
			body		+='</table></div></div>';
		}
		body		+='</div>';
		body		+='</div></div>';
	
		return body;
	};
	this.topContents		= function (game) {
		let body		= '<div class="card bg-light"><div class="card-body">';
		body			+='<div class="row">';
		body			+='<div class="col-md-2 panel"><h4 class="card-title font-weight-bold">'+abi.contents[game].name+'</h4>Game is .....</div>';
		body			+="<div class='col-md-10 panel'>";

		for(let i=0 ; i < abi.contents[game].address.length ; i++) {
			body	+= page.historyTable(game,abi.contents[game].address[i]);
			if(i<abi.contents[game].length-1)
				body	+= "&nbsp<br/>";
		}

		body		+=	'</div></div></div></div>';
		return body;
	};
	this.historyTable	= function (game,address) {
		let table	= '';
		if(page.parameter['game']==-1 || page.parameter['contract']=='') {
			if(wallet.state()==2)
				table	+='<div class="row"><div class="col-md-6 text-bottom" style="font-size:1.4em;" id="infotitle_'+game+'_'+address+'"></div><div class="col-md-6 card-text text-right" id="infobtn_'+game+'_'+address+'"><button data-toggle="modal" data-target="#modalDialog" type="button" class="btn btn-primary btn-sm text-secondary" onClick="page.information('+game+',\''+address+'\')">'+iInfo+'</button><button type="button" class="btn btn-primary btn-sm text-secondary" onClick="script:page.enter('+game+',\''+address+'\')">'+iCard+'</button></div></div>';
			else
				table	+='<div class="row"><div class="col-md-6 text-bottom" style="font-size:1.4em;" id="infotitle_'+game+'_'+address+'"></div><div class="col-md-6 card-text text-right" id="infobtn_'+game+'_'+address+'"><button type="button" class="btn btn-primary btn-sm text-secondary" onClick="window.open(\''+NETWORK.ethscan+'/address/'+address+'\',\'_blank\')">'+iCont+'</button></div></div>';
		}
		table		+="<div id='history_"+game+'_'+address+"'><div style='overflow-x:auto;'><table class='border border-secondary'>";

		for(let i = 0 ; i < page.historyRow ; i ++){
			table +="<tr>";
			for(let j = 0 ; j < page.historyCol ; j++)
				if((i*3+j)%2==0)
					table +="<td class='align-middle' bgcolor='#DEDEDE'><div style='width:16px;' id='history_"+game+'_'+address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
				else
					table +="<td class='align-middle bg-light'><div style='width:16px;' id='history_"+game+'_'+address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
			table +="</tr>";
		}
		table	+="</table></div></div>";
		
		return table;
	};
	this.information		= function (game,address) {
		page.modalUpdate(abi.contents[game].name,"Now loading....");
		wallet.updateTimer(true);
		abi.information(game,address,function(_game,_address,_data){
				let table	= "<div style='overflow-x:auto;'><table class='table table-striped table-hover'><tbody>";

				table		+='<tr><td>Contract</td><td><a style="cursor:hand" onClick="window.open(\''+NETWORK.ethscan+'/address/'+_address+'\',\'_blank\')"><small>'+_address+"</small></td></tr>";
				table		+="<tr><td>Round</td><td>"+_data[0][0] +"-" + _data[0][1] +"-" + _data[0][2]+"</td></tr>";
				table		+="<tr><td>State</td><td>"+_data[1]+"</td></tr>";

				if(game!=3) {
					table		+="<tr><td>Bet</td><td>"+wallet.web3.fromWei(_data[4])+" ETH</td></tr>";
					table		+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(_data[6])+" ETH</td></tr>";
					table		+="<tr><td>Pending transfer</td><td>"+_data[11]+" remains</td></tr>";
					table		+="<tr><td>Bankers Deposit</td><td>"+wallet.web3.fromWei(_data[7])+" ETH </td></tr>";
					table		+="<tr><td>Bankers</td><td>"+_data[8].length+" / "+ _data[9].toNumber()+" accounts </td></tr>";
					table		+="<tr><td>Waitings</td><td>"+_data[10].length+" accounts </td></tr>";
				} else {
					table		+="<tr><td>Price</td><td>"+wallet.web3.fromWei(_data[3])+" ETH</td></tr>";
					table		+="<tr><td>Transfer fee</td><td>"+wallet.web3.fromWei(_data[5])+" ETH</td></tr>";
					table		+="<tr><td>Pending transfer</td><td>"+_data[6]+" remains</td></tr>";
					table		+="<tr><td>My tickets</td><td>"+_data[7]+"</td></tr>";
				}
				
				table		+="</tbody></table></div>";
				page.modalUpdate(abi.contents[game].name,table);
			});
	};
	this.updateContents	= function (game,address,data) {
		switch(game) {
			case 0:
			case 1:
			case 2:
				page.historyCasino(game,address,data);
				page.updateGame(game,address,data);
				break;
			case 3:
				page.historyLotto(game,address,data);
				break;
		}
	};
	this.historyLotto	= function (game,address,data) {
		// test
		//console.log(game);
		//console.log(data);
		// test
		// todo : lotto
		let marker	= [];
		let counter	= [];
		for(let i = 0 ; i < 9 ; i++) {
			marker.push(1<<i);
			counter.push(0);
		}

		for(let i = 0 ; i < data[2].length ; i++) {
			let temp		= data[2][i].toString(2);
			let prize	= parseInt(temp.substring(0,temp.length-128),2);
			let bonus	= parseInt(temp.substring(temp.length-128,temp.length),2);
			
			for(let j = 0 ; j < marker.length ; j++ ) {
				counter[j] += (marker[j]&prize)>0?1:0;
				counter[j] += (marker[j]&bonus)>0?1:0;
			}
		}
				
		for(let i = 0 ; i < counter.length ; i++ )
			$('#lotto_0_'+i).html(counter[i]);	// todo
		
		for(let i = (data[2].length>4 ? data[2].length-4 : 0), k = 1 ; i < data[2].length ; i++,k++)  {

			let temp		= data[2][i].toString(2);
			let prize	= parseInt(temp.substring(0,temp.length-128),2);
			let bonus	= parseInt(temp.substring(temp.length-128,temp.length),2);

			$('#lottoRound_'+k).html("Round "+(i+1));
			
			for(let j = 0 ; j < marker.length ; j++ ) {
				let mark		= '&nbsp';
				if(marker[j]&prize) 			mark	= '<a style="opacity: 1; color: #000000;">&#93'+(12+j)+'</a>'; 	// todo
				else if(marker[j]&bonus)		mark= '<a style="opacity: 1; color: #FF5722;">&#93'+(12+j)+'</a>';	// todo 
				else							mark= '<a style="opacity: 0.2;">&#93'+(12+j)+'</a>';					// todo
				$('#lotto_'+k+'_'+j).html(mark);
			}
		}
	};
	this.historyCasino	= function (game,address,data) {
		// todo : show betprice
		let history = new Array();

		for(let i = 0 ; i < data[2].length ; i++) {
			let raw = data[2][i].toNumber();
			history.push({'raw':raw,'1st':[page.bitwise(raw,0),page.bitwise(raw,8),page.bitwise(raw,16),page.bitwise(raw,24)],'2nd':[page.bitwise(raw,32),page.bitwise(raw,40),page.bitwise(raw,48),page.bitwise(raw,56)]});			
		}
		for(let i = 0 ; i < page.historyRow ; i ++)
			for(let j = 0 ; j < page.historyCol ; j++)
				$('#history_'+game+'_'+address+'_'+j+'_'+i).html('&nbsp');

		let red		= "<i class='material-icons' style='font-size:16px;color:red'>brightness_1</i>";
		let blue		= "<i class='material-icons' style='font-size:16px;color:blue'>brightness_1</i>";
		let green	= "<i class='material-icons' style='font-size:16px;color:green'>brightness_1</i>";
		let toolTip	= '';

		let x1		= 0;
		let x2		= 0;
		let y		= 0;
		let b		= -1;

		$('#infotitle_'+game+'_'+address).html("Round "+data[0][0].toNumber()+"-"+data[0][1].toNumber()+"-"+data[0][2].toNumber());
		//$(function () {$('[data-toggle="tooltip"]').tooltip(disable)});
		// test
		//console.log(game);
		//console.log(data);
		// test
		
		for(let i = 0 ; i < history.length ; i++){
			// test
			//console.log(page.binaryString(history[i]['raw']));
			//console.log(history[i]);
			// test
			
			let win = 0;
			
			switch(game){
				case 0:
					let b	= (page.cut10(page.card(history[i]['1st'][0]))+page.cut10(page.card(history[i]['1st'][1])))%10;
					b		= history[i]['1st'][2]==0?b:(b+page.cut10(page.card(history[i]['1st'][2])))%10;
					let p	= (page.cut10(page.card(history[i]['2nd'][0]))+page.cut10(page.card(history[i]['2nd'][1])))%10;
					p		= history[i]['2nd'][2]==0?p:(p+page.cut10(page.card(history[i]['2nd'][2])))%10;
					toolTip = '('+b+','+p+')';
					win 		= b>p?1:b<p?2:3;
					break;
				case 1:
				case 2:
					let c1	= page.card(history[i]['1st'][0]);
					let c2	= page.card(history[i]['2nd'][0]);
					toolTip = '('+c1+','+c2+')';
					win 		= c1>c2?1:c1<c2?2:3;
					break;
					break;
			}
			
			if(b==win) {
				if(y == (page.historyRow-1) || $('#history_'+game+'_'+address+'_'+x1+'_'+(y+1)).html()!='&nbsp;' ) {
					x2++;
				} else {
					y++;
				}
			} else if(b!=-1) {
				x1++;
				x2	= 0;
				y	= 0;
			}
			
			if(win==1)		$('#history_'+game+'_'+address+'_'+(x1+x2)+'_'+y).html('<a style="cursor:hand" data-toggle="tooltip" title="'+toolTip+'">'+red+'</a>');	// banker, dragon, high
			else if(win==2)	$('#history_'+game+'_'+address+'_'+(x1+x2)+'_'+y).html('<a style="cursor:hand" data-toggle="tooltip" title="'+toolTip+'">'+blue+'</a>');	// player, tigher, low
			else if(win==3)	$('#history_'+game+'_'+address+'_'+(x1+x2)+'_'+y).html('<a style="cursor:hand" data-toggle="tooltip" title="'+toolTip+'">'+green+'</a>');	// tie
			else				$('#history_'+game+'_'+address+'_'+(x1+x2)+'_'+y).html('<a style="cursor:hand" data-toggle="tooltip" title="'+toolTip+'">!</a>');			// error 

			b = win;
		}
		
		//$(function () {$('[data-toggle="tooltip"]').tooltip()});
	};
	this.card			= function(index) {
		return (index-1)%13+1;
	};
	this.cut10			= function(num) {
		return num>9?0:num;
	};
	this.bitwise			= function(num, from, size=8) {
		let length	= 64;
		let str		= num.toString(2);
		if (str.length < length) str = Array(length - str.length + 1).join("0") + str;
		return parseInt( str.slice(length-from-size,str.length-from), 2 );
	};
	this.binaryString	= function(num,length=64) {
		let str		= num.toString(2);
		if (str.length < length) str = Array(length - str.length + 1).join("0") + str;
		return str;
	};
	// top page
	// game page
	this.game			= function () {
		let body		= '<br/><div class="card bg-light"><div class="card-body">';
		
		body			+='<div><h3><a style="cursor:hand" onClick="window.open(\''+NETWORK.ethscan+'/address/'+page.parameter['contract']+'\',\'_blank\')">'+abi.contents[page.parameter['game']].name+'</a></h3></div>';
		body			+='<div class="row" id="top">';
		body			+='<div class="col-md-6 panel" id="gameFrame"><canvas id="gameCanvas" width=720 height=720 style="background: linear-gradient(to bottom, #33cc33 0%, #006600 100%)"></canvas></div>';
		body			+='<div class="col-md-6 panel">';
		body			+='<div id="information"><div id="line"><h6>HISTORY</h6></div>'+page.historyTable(page.parameter['game'],page.parameter['contract'])+'</div><br/>';
		body			+='<div><h6>CHAT</h6></div>';
		body			+='<div class="list-unstyled" id="chatmessage" align="left" style="overflow-y:auto;background-color:#DEDEDE;"></div>';
		body			+='<div><input id="chatInput" type="text" class="form-control" placeholder="message"></div>';
		body			+='</div>';
		body			+='</div></div></div><br/>';
		
		$('#contentsBody').html(body);
		page.runGame();
	};
	this.updateGame		= function(game,contract,data) {
		if(page.parameter['game']<0 || page.casinoGame==null) {
			page.casinoGame = null;
			return;
		}
		page.casinoGame.onUpdateCasino(game,contract,data);
	};
	this.resize			= function() {
		if(page.parameter['game']<0) {
			let gap = $("#lottoStat_0").width()*2>$("#lottoTop").width()?true:false;
			
			for(let i = 0 ; i < 5 ; i++ ) {
				if(i>0)
					$("#lottoRoundT_"+i).html(gap?'<br/>':'');
				// todo : lotto sort
			}
		} else {
	        $("#gameCanvas").width($("#gameFrame").innerWidth() -30);
	        $("#gameCanvas").height($("#gameCanvas").width());
	        if(($("#gameCanvas").width()+30)==$("#top").width()) {
	            $("#chatmessage").height($("#chatmessage").width());
	            $('#line').html('<br/><h6>HISTORY</h6>');
	        } else {
	        		$("#chatmessage").height($("#gameCanvas").height()-$("#information").height()-$("#chatInput").height()-60);
	        		$('#line').html('<h6>HISTORY</h6>');
	        }
		}
	};
	// game page
	
	// game
	this.runGame		= function() {
		cc.game.onStart = function() {
			cc.director.setDisplayStats(false);
		    cc.view.enableRetina(true);
		    cc.view.adjustViewPort(true);
		    cc.view.resizeWithBrowserSize(true);
		    cc.LoaderScene.preload(g_resources, function () {
		    		cc.spriteFrameCache.addSpriteFrames(g_resources[0].src,g_resources[1].src);
		    		page.casinoGame = new casinoScene(page.parameter['game'],page.parameter['contract']);
		    		abi.makeUpdateEvent(page.parameter['game'],page.parameter['contract']);
		    		cc.director.runScene(page.casinoGame);
		    }, cc.game);
		};
		cc.game.run();		
	}
	// game
}