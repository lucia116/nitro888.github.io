let playingcards = cc.Sprite.extend({
	cards:[  "#card_b_ca.png",
			 "#card_b_c2.png",
			 "#card_b_c3.png",
			 "#card_b_c4.png",
			 "#card_b_c5.png",
			 "#card_b_c6.png",
			 "#card_b_c7.png",
			 "#card_b_c8.png",
			 "#card_b_c9.png",
			 "#card_b_c10.png",
			 "#card_b_cj.png",
			 "#card_b_cq.png",
			 "#card_b_ck.png",
			 "#card_b_ha.png",
			 "#card_b_h2.png",
			 "#card_b_h3.png",
			 "#card_b_h4.png",
			 "#card_b_h5.png",
			 "#card_b_h6.png",
			 "#card_b_h7.png",
			 "#card_b_h8.png",
			 "#card_b_h9.png",
			 "#card_b_h10.png",
			 "#card_b_hj.png",
			 "#card_b_hq.png",
			 "#card_b_hk.png",
			 "#card_b_da.png",
			 "#card_b_d2.png",
			 "#card_b_d3.png",
			 "#card_b_d4.png",
			 "#card_b_d5.png",
			 "#card_b_d6.png",
			 "#card_b_d7.png",
			 "#card_b_d8.png",
			 "#card_b_d9.png",
			 "#card_b_d10.png",
			 "#card_b_dj.png",
			 "#card_b_dq.png",
			 "#card_b_dk.png",
			 "#card_b_sa.png",
			 "#card_b_s2.png",
			 "#card_b_s3.png",
			 "#card_b_s4.png",
			 "#card_b_s5.png",
			 "#card_b_s6.png",
			 "#card_b_s7.png",
			 "#card_b_s8.png",
			 "#card_b_s9.png",
			 "#card_b_s10.png",
			 "#card_b_sj.png",
			 "#card_b_sq.png",
			 "#card_b_sk.png"],
	back:null,
	front:null,
	callbackAfterOpen:null,
	index:-1,
	onTable:false,
    ctor:function (callbackAfterOpen,index) {
		this._super();
		this.callbackAfterOpen	= callbackAfterOpen;
		this.index				= index;
		this.back				= cc.Sprite.createWithSpriteFrameName("#deck_1.png");
		this.back.setScale(0.8);
	    this.addChild(this.back);
    },
    open:function (from,to,card,delay=0.5) {
    		if(card==0)
    			return;
    		if(this.front==null && !this.onTable) {
			this.setScale(1,1);
			this.setPosition(from);
			this.back.visible	=true;

			this.front			= cc.Sprite.createWithSpriteFrameName(this.cards[card-1]);
			this.front.visible	= false;
			this.front.setScale(0.8);
			this.addChild(this.front);
			
			let moveTo	= cc.MoveTo.create(0.2, to);
			let flipB	= cc.ScaleTo.create(0.1, 0, 1);
			let flipF	= cc.ScaleTo.create(0.1, 1, 1);

			let that		= this;
			this.number	= card[1];

			let action	= cc.Sequence.create(
								cc.DelayTime.create(delay),cc.Spawn.create(cc.CallFunc.create(function(){that.cardSlideFX();}),moveTo),
								cc.Spawn.create(cc.CallFunc.create(function(){that.cardPlaceFx();}),flipB),
								cc.CallFunc.create(function(){that.back.visible=false;if(that.front!=null)that.front.visible=true;}),
								flipF,
								cc.DelayTime.create(0.1),
								cc.CallFunc.create(function(){that.callbackAfterOpen(that.index);}));

			this.runAction(action);					
		} else if(this.front==null && this.onTable) {
			this.back.visible	= false;
			this.front			= cc.Sprite.createWithSpriteFrameName(this.cards[card-1]);
			this.front.visible	= true;
			this.front.setScale(0.8);
			this.addChild(this.front);
			
			this.setPosition(to);
		}

		this.onTable			= true;    	
    },
    close:function(to) {
    		if(this.onTable) {
    			let moveTo	= cc.MoveTo.create(0.2, to);
    			
    			let that		= this;
    			let action	= cc.Sequence.create(cc.Spawn.create(cc.CallFunc.create(function(){that.cardSlideFX();}),moveTo),cc.CallFunc.create(function(){if(that.front!=null){that.removeChild(that.front);that.front	= null;}}));
    			this.runAction(action);    			
    		} else {
    			if(this.front!=null) {
    				this.removeChild(this.front);
    				this.front	= null;
    			}
    			this.setPosition(to);
		}
    		this.onTable	= false;
    },
    cardSlideFX:function() {
    		cc.audioEngine.playEffect(g_resources[parseInt(Math.random() * 3 + 9)].src);
    },
    cardPlaceFx:function() {
    		cc.audioEngine.playEffect(g_resources[parseInt(Math.random() * 2 + 7)].src);
    }
});

let messageBox = cc.Layer.extend({
	message:null,
	boxBG:null,
    ctor:function () {
		this._super();
		
		let line		= cc.Sprite.createWithSpriteFrameName("#box.png");
		line.setPosition(cc.winSize.width/2,cc.winSize.height/2+70+210);
		line.setScale(48,1);
		line.setColor(cc.color(0, 0, 0));
		this.addChild(line);
		line			= cc.Sprite.createWithSpriteFrameName("#box.png");
		line.setPosition(cc.winSize.width/2,cc.winSize.height/2-70+210);
		line.setScale(48,1);
		line.setColor(cc.color(0, 0, 0));
		this.addChild(line);

    		this.boxBG	= cc.Sprite.createWithSpriteFrameName("#box.png");
		this.boxBG.setPosition(cc.winSize.width/2,cc.winSize.height/2+210);
		this.boxBG.setScale(48,8);
		this.boxBG.setColor(cc.color(0, 0, 0));
		this.boxBG.setOpacity(189);
		this.addChild(this.boxBG);

        	this.message	= cc.LabelTTF.create("BANKER", "Roboto", 100);
        	this.message.setPosition(cc.winSize.width/2,cc.winSize.height/2+210);
	    this.addChild(this.message);

	    	this.showMessage(false);
    },
    showMessage:function(visible,state=-1,message="") {
    		this.visible			= (state==3)&&visible;
    		this.message.string	= message;
    }
});

let gameScene = cc.Scene.extend({
	game:-1,
	contract:null,
	round:null,
	betEnable:false,
	state:-1,
	oddUI:{'bet0':{'point':0,'odd':0},'bet1':{'point':0,'odd':0},'bet2':{'point':0,'odd':0}},
	fxUI:new Array(),
	messageBox:null,
	openCards:new Array(),
	ctor:function (game,contract) {
		this._super();
		this.game		= game;
		this.contract	= contract;
	},
	onEnter:function () {
        this._super();
		switch(this.game) {
			case 'baccarat':
				this.initBaccarat();
				this.initGeneral();
				break;
			case 'dragonTiger':
				this.initDragonTiger();
				this.initGeneral();
				break;
			case 'highLow':
				this.initHighLow();
				this.initGeneral();
				break;
		}
		this.updateUI();
		this.messageBox	= new messageBox();
		this.addChild(this.messageBox);
    },
    onUpdateGame:function(game,contract,data) {
    		if(game!=this.game||contract!=this.contract)
    			return;

    		if(this.state!=data[1].toNumber()) {
        		this.state		= data[1].toNumber();

        		if(this.round!=null)
        			this.round.string	= 'Round '+data[0][0]+'-'+data[0][1]+'-'+data[0][2];

        		switch(data[1].toNumber()) {
	    	    		case 1:
	    	    			this.betEnable	= true;
	    	    			break;
	    	    		default:
	    	    			this.betEnable	= false;
	    	    			break;
        		}

        		this.updateCards(data);
        		this.updateUI();
    		}
    },
    updateUI:function() {
		for(let i = 0 ; i < this.fxUI.length ; i++)
			this.fxUI[i].setOpacity(this.betEnable?255:128);
    },
    initBetButtons(root,posX,posY,eventSelector,slot,multi,spriteName) {
    		let btn	= cc.Sprite.createWithSpriteFrameName("#"+spriteName+".png");
    		btn.setPosition(new cc.Point(posX,posY));
    		root.addChild(btn);

    		let that		= this;
    		let listener	= cc.EventListener.create({
    		    'event': cc.EventListener.TOUCH_ONE_BY_ONE,
    		    'eventSelector':eventSelector,
    		    'onTouchBegan': function (touch, event) {
    		    		if(!that.betEnable)
    		    			return false;
    		    		let target			= event.getCurrentTarget();
    		    		let scale			= cc.winSize.width/(cc.view.getFrameSize().width-30);
    		    		let location			= touch.getLocation();
    		    		location.x			*=scale;
    		    		location.y			*=scale;
    		    		let locationInNode	= target.convertToNodeSpace(location);	
    			    let s				= target.getContentSize();
    			    let rect				= cc.rect(0, 0, s.width, s.height);
    			        			    
    			    if (cc.rectContainsPoint(rect, locationInNode)) {
    				    target.opacity = 180;
    				    	this.eventSelector(that,slot,multi);
    				    cc.audioEngine.playEffect(g_resources[3].src);
    				    return true;
    			    }
    			    return false;
    		    },
    		    onTouchEnded: function (touch, event) {			
    			    let target = event.getCurrentTarget();			    
    			    	target.setOpacity(255);
    		    }
    	    });    		
    		
    		cc.eventManager.addListener(listener, btn);
    		
    		return btn;
    },
    initGeneral:function () {
		this.round = cc.LabelTTF.create("", "Roboto", 40);
		this.round.setPosition(cc.winSize.width / 2, cc.winSize.height -45);
		this.addChild(this.round, 1);
    },
    initBetPot:function(posX,posY,name,odds,eventBet,slot) {
		let pot = cc.Sprite.createWithSpriteFrameName("#frame.png");
		pot.setPosition(posX,posY);
	    this.addChild(pot);
	    this.fxUI.push(pot);

		let label = cc.LabelTTF.create(name, "Roboto", 30);
	    label.setPosition(posX,posY+55);
		this.addChild(label);
		this.fxUI.push(label);
		
	    let odd = cc.LabelTTF.create("x "+odds, "Roboto", 20);
	    odd.setPosition(posX,posY-60);
		this.addChild(odd);
		this.fxUI.push(odd);
		
		this.fxUI.push(this.initBetButtons(pot,33,-12,eventBet,slot,1,'btnBetx1'));
		this.fxUI.push(this.initBetButtons(pot,99.5,-12,eventBet,slot,2,'btnBetx2'));
		this.fxUI.push(this.initBetButtons(pot,166,-12,eventBet,slot,3,'btnBetx3'));
		this.fxUI.push(this.initBetButtons(pot,33,-44,eventBet,slot,4,'btnBetx4'));
		this.fxUI.push(this.initBetButtons(pot,99.5,-44,eventBet,slot,5,'btnBetx5'));
		this.fxUI.push(this.initBetButtons(pot,166,-44,eventBet,slot,6,'btnBetx6'));

	    return odd;
    },
    initLogo:function(spriteName) {
		let sprite = cc.Sprite.createWithSpriteFrameName("#"+spriteName+".png");
	    sprite.setPosition(cc.winSize.width/2,cc.winSize.height/5*3);
	    sprite.setOpacity(128);
	    this.addChild(sprite);
    },
    initBaccarat:function () {
    		this.initLogo('baccarat');
    	
    		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-218,cc.winSize.height/5+20,"BANKER","1.95",this.clickBet,0);
    		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+218,cc.winSize.height/5+20,"PLAYER","2",this.clickBet,1);
    		this.oddUI['bet2']['odd']	= this.initBetPot(cc.winSize.width/2,	cc.winSize.height/5+20,"TIE","9",this.clickBet,2);
    		
    		this.oddUI['bet0']['point']	= cc.LabelTTF.create("", "Roboto", 30);
    		this.oddUI['bet0']['point'].setPosition(cc.winSize.width/2-50,cc.winSize.height/2-30);
    		this.addChild(this.oddUI['bet0']['point']);
    		
    		this.oddUI['bet1']['point']	= cc.LabelTTF.create("", "Roboto", 30);
    		this.oddUI['bet1']['point'].setPosition(cc.winSize.width/2+50,cc.winSize.height/2-30);
    		this.addChild(this.oddUI['bet1']['point']);
    		
    		// banker
    		let sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(cc.winSize.width/2-258,cc.winSize.height/2-55);
    	    this.addChild(sprite);
    	
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(cc.winSize.width/2-128,cc.winSize.height/2-55);
    	    this.addChild(sprite);
    	    
    	    // player
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(cc.winSize.width/2+258,cc.winSize.height/2-55);
    	    this.addChild(sprite);
    	    
    	    // tie
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(cc.winSize.width/2+128,cc.winSize.height/2-55);
    	    this.addChild(sprite);
    	    
    	    // cards openCards
    	    this.initCards(6);
    },
    initDragonTiger:function () {
    		this.initLogo('dragontiger');
    	
		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-218,cc.winSize.height/5+20,"DRAGON","2",this.clickBet,0);
		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+218,cc.winSize.height/5+20,"TIGER","2",this.clickBet,1);
		this.oddUI['bet2']['odd']	= this.initBetPot(cc.winSize.width/2,	cc.winSize.height/5+20,"TIE","9",this.clickBet,2);
		
		this.oddUI['bet0']['point']	= cc.LabelTTF.create("", "Roboto", 30);
		this.oddUI['bet0']['point'].setPosition(cc.winSize.width/2-50,cc.winSize.height/2-30);
		this.addChild(this.oddUI['bet0']['point']);
		
		this.oddUI['bet1']['point']	= cc.LabelTTF.create("", "Roboto", 30);
		this.oddUI['bet1']['point'].setPosition(cc.winSize.width/2+50,cc.winSize.height/2-30);
		this.addChild(this.oddUI['bet1']['point']);

		// dragon
        let sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2-109,cc.winSize.height/2-55));
        this.addChild(sprite);

        // tiger
        sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2+109,cc.winSize.height/2-55));
        this.addChild(sprite);
        
	    // cards openCards
        this.initCards(2);
    },
    initHighLow:function () {
    		this.initLogo('highlow');
    	
		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-125,cc.winSize.height/5+20,"HIGH","?",this.clickBet,0);
		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+125,cc.winSize.height/5+20,"LOW","?",this.clickBet,1);
		
		// 1st
        let sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2-109,cc.winSize.height/2-55));
        this.addChild(sprite);

        // 2nd
        sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2+109,cc.winSize.height/2-55));
        this.addChild(sprite);
        
	    // cards openCards
        this.initCards(2);
    },
    initCards:function(count) {
	    for(let i = 0 ; i < count ; i++) {
	    		let openCard = new playingcards(this.afterOpen,i);
	    		openCard.setPosition(cc.winSize.width/2,cc.winSize.height*1.5);
	    		this.openCards.push(openCard);
	    		this.addChild(openCard);
	    }    	
    },
    randomPosition:function(pos) {
    		return new cc.Point(pos.x + Math.floor(Math.random() * 8) + 1 ,pos.y + Math.floor(Math.random() * 6) + 1 ) 
    },
    updateCards:function(data) {
    		let openCards	= util.openCards(data[3].toNumber());
    		let win			= util.win(this.game,openCards)['win'];
    		let from			= new cc.Point(cc.winSize.width/2,cc.winSize.height*1.5);

    		switch(this.game) {
    			case 'baccarat':
    				if(this.state==3) {
    					let pos11		= this.randomPosition(new cc.Point(cc.winSize.width/2-258 ,cc.winSize.height/2+10));
    					let pos12		= this.randomPosition(new cc.Point(cc.winSize.width/2-128 ,cc.winSize.height/2+10));
    					let pos13		= this.randomPosition(new cc.Point(cc.winSize.width/2-200 ,cc.winSize.height/2+115));
    					let pos21		= this.randomPosition(new cc.Point(cc.winSize.width/2+258 ,cc.winSize.height/2+10));
    					let pos22		= this.randomPosition(new cc.Point(cc.winSize.width/2+128 ,cc.winSize.height/2+10));
    					let pos23		= this.randomPosition(new cc.Point(cc.winSize.width/2+200 ,cc.winSize.height/2+115));

    					this.openCards[3].open(from,pos21,openCards['2nd'][0],0);
    					this.openCards[4].open(from,pos22,openCards['2nd'][1],1);
    					this.openCards[5].setRotation(90);
    					this.openCards[5].open(from,pos23,openCards['2nd'][2],2);

    					this.openCards[0].open(from,pos11,openCards['1st'][0],0.5);
    					this.openCards[1].open(from,pos12,openCards['1st'][1],1.5);
    					this.openCards[2].setRotation(90);
    					this.openCards[2].open(from,pos13,openCards['1st'][2],openCards['2nd'][2]==0?2:2.5);
    					
    					let that		= this;
    					let mssage	= win==1?'Banker Win':win==2?'Player Win':win==3?'Tie Win':'error';
    					setTimeout(function() { that.messageBox.showMessage(true,that.state,mssage); }, 5000);
    				} else {
    					this.closeAll(from);
    					this.messageBox.showMessage(false);
    				}
    				break;
    			case 'dragonTiger':
    				if(this.state==3) {
    					let pos1			= this.randomPosition(new cc.Point(cc.winSize.width/2-109 ,cc.winSize.height/2+10));
    					let pos2			= this.randomPosition(new cc.Point(cc.winSize.width/2+109 ,cc.winSize.height/2+10));
    					this.openCards[0].open(from,pos1,openCards['1st'][0]);
    					this.openCards[1].open(from,pos2,openCards['2nd'][0],1);
    					
    					let that		= this;
    					let mssage	= win==1?'Dragon Win':win==2?'Tiger Win':win==3?'Tie Win':'error';
    					setTimeout(function() { that.messageBox.showMessage(true,that.state,mssage); }, 5000);
    				} else {
    					this.closeAll(from);
    					this.messageBox.showMessage(false);
    				}
    				break;
    			case 'highLow':
    				if(this.state==1 || this.state==2) {
    					let pos1			= this.randomPosition(new cc.Point(cc.winSize.width/2-109 ,cc.winSize.height/2+10));
    					this.openCards[0].open(from,pos1,openCards['1st'][0]);
    					this.messageBox.showMessage(false);
    					this.showHighLowOdds(openCards['1st'][0]);
    				} else if(this.state==3) {
    					this.openCards[0].onTable	= true;
    					let pos1			= this.randomPosition(new cc.Point(cc.winSize.width/2-109 ,cc.winSize.height/2+10));
    					this.openCards[0].open(from,pos1,openCards['1st'][0]);	    					
    					let pos2			= this.randomPosition(new cc.Point(cc.winSize.width/2+109 ,cc.winSize.height/2+10));
    					this.openCards[1].open(from,pos2,openCards['2nd'][0],1);
    					this.showHighLowOdds(openCards['1st'][0]);

    					let that		= this;
    					let mssage	= win==1?'High Win':win==2?'Low Win':win==3?'Tie':'error';
    					setTimeout(function() { that.messageBox.showMessage(true,that.state,mssage); }, 5000);
    				} else {
    					this.closeAll(from);
    					this.messageBox.showMessage(false);
    					this.showHighLowOdds(0);
    				}
    				break;
    		}
    },
    showHighLowOdds:function(card) {
    		const odds	= [[10.7,1.1],[5.3,1.1],[3.5,1.1],[2.6,1.3],[2.1,1.5],[1.87,1.87],[1.5,2.1],[1.3,2.6],[1.1,3.5],[1.1,5.3],[1.1,10.7]];
    		if(card!=0) {
    			this.oddUI['bet0']['odd'].string	= "x "+odds[util.card(card)-2][1]; 
    			this.oddUI['bet1']['odd'].string = "x "+odds[util.card(card)-2][0];
    		} else {
    			this.oddUI['bet0']['odd'].string	= "x ?"; 
    			this.oddUI['bet1']['odd'].string = "x ?";
    		}
    },
    closeAll:function(to) {
		for(let i = 0 ; i < this.openCards.length ; i++)
			this.openCards[i].close(to);
    },
    afterOpen:function(index) {
    		// todo : score
    },
    clickBet:function (that,slot,multi) {
    		console.log("bet"+slot+"x"+multi);
    }
});
