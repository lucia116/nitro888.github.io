let page = new function() {
	this.game		= '',
	this.address		= '',
	this.scene		= null,
	this.socketUrl	= 'https://nitro888main.herokuapp.com',
	this.showInfo	= function () {
		modal.update(CONFIG[page.game]['name'],'Now Loading...');
		wallet.web3.eth.contract(CONFIG[page.game]['abi']).at(page.address).information(function(e,r){if (!e){util.updateInfo(page.game,page.address,r);}});				
	},
	this.history		= function() {
		let body		= '';
		body		+="<div style='overflow-x:auto;'><table class='border border-secondary'>";
		for(let i = 0 ; i < util.historyRow ; i ++){
			body +="<tr>";
			for(let j = 0 ; j < util.historyCol ; j++)
				if((i*3+j)%2==0)
					body	+="<td class='align-middle' bgcolor='#DEDEDE'><div style='width:16px;' id='history_"+page.game+'_'+page.address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
				else
					body	+="<td class='align-middle bg-light'><div style='width:16px;' id='history_"+page.game+'_'+page.address+"_"+j+"_"+i+"' align='center'>&nbsp</div></td>";
			body	+="</tr>";
		}
		body		+="</table></div>";
		body		+='<div class="row"><div class="col-md-6"><small id="pot_'+page.game+'_'+page.address+'"></small></div><div class="col-md-6"><small style="float:right;" id="price_'+page.game+'_'+page.address+'"></small></div></div>';
		
		$("#gameHistory").html(body);
	},
	this.start		= function () {
		let url		= new URL(location.href);

		page.game	= url.searchParams.get("g");
		page.address	= url.searchParams.get("a");
		page.history();
		page.resize();
		
		$.getJSON('../config.json', function(data) {
			if(data!=null) {
				CONFIG	= data;
				if(!page.game || !page.address || !CONFIG[page.game] || !util.isGameAddress(page.game,page.address))
					location.href=location.origin;
				else {
					$('#gameTitle').html('<strong>'+CONFIG[page.game]['name']+'</strong>');
					cc.game.onStart = function() {
						cc.director.setDisplayStats(false);
					    cc.view.enableRetina(true);
					    cc.view.adjustViewPort(true);
					    cc.view.resizeWithBrowserSize(true);
					    cc.LoaderScene.preload(g_resources, function () {
					    		cc.spriteFrameCache.addSpriteFrames(g_resources[0].src,g_resources[1].src);
					    		page.scene = new gameScene(page.game,page.address); 
					    		cc.director.runScene(page.scene);

					    		wallet.start(page.update);
					    		socket.start('#chatmessage','#chatInput',page.socketUrl,page.updateSchedule,storage.address);
					    		
					    		setInterval(function(){page.scene.onUpdateInformation();},1000);
					    }, cc.game);
					};
					cc.game.run();
				}
			}				
		});
		
		$(window).focus(function(){socket.schedule(page.address);page.scene.onFocus();});
	},
	this.update		= function () {
		if(wallet.state()!=2)
			location.href=location.origin;
		else
			wallet.web3.eth.contract(CONFIG[page.game]['abi']).at(page.address).information(
					function(e,r){
						if (!e){
							util.updateCasino(page.game,page.address,r);
							$('#gameRound').html('<strong>Round '+r[0][0]+'-'+r[0][1]+'-'+r[0][2]+'</strong><small> ('+util.getGameState(parseInt(r[1]))+')</small>');
							$('#price').html("Bet : "+wallet.web3.fromWei(r[4].toNumber(),'ether')+" E");
							if(page.scene.onUpdateGame(page.game,page.address,r)) 
								socket.schedule(page.address);
						}});
	},
	this.resize		= function () {
        $("#gameCanvas").width($("#gameFrame").innerWidth()-30);
        $("#gameCanvas").height($("#gameCanvas").width());
        if(($("#gameCanvas").width()+30)==$("#gameTop").width()) {
            $("#chatmessage").height($("#chatmessage").width());
            $('#line').html('<br/><h6>HISTORY</h6>');
        } else {
        		$("#chatmessage").height($("#gameCanvas").height()-$("#gameHistory").height()-$("#chatInput").height()-20);
        		$('#line').html('<h6>HISTORY</h6>');
        }
	},
	this.updateSchedule	= function(data) {
		page.scene.time=data['time'];
		for(let i=0;i<data['schedule'].length;i++) {
			if(data['schedule'][i]['address']==page.address) {
				page.scene.last=parseInt(data['schedule'][i]['last']);
				page.scene.next=parseInt(data['schedule'][i]['next']);
			}
		}
	}
}		
function UPDATE() {}