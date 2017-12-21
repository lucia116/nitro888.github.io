let casinoScene = cc.Scene.extend({
	game:false,
	contract:null,
	round:null,
	betEnable:false,
	oddUI:{'bet0':{'point':0,'odd':0},'bet1':{'point':0,'odd':0},'bet2':{'point':0,'odd':0}},
	fxUI:new Array(),
	ctor:function (game,contract) {
		this._super();
		this.game		= game;
		this.contract	= contract;
	},
	onEnter:function () {
        this._super();
		switch(this.game) {
			case 0:
				this.initBaccarat();
				this.initGeneral();
				break;
			case 1:
				this.initDragonTiger();
				this.initGeneral();
				break;
			case 2:
				this.initHighLow();
				this.initGeneral();
				break;
		}
		this.updateUI();
    },
    onUpdateCasino:function(game,contract,data) {
    		if(game!=this.game||contract!=this.contract)
    			return;

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
    		this.updateUI();
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
		this.round.setPosition(cc.winSize.width / 2, cc.winSize.height -30);
		this.addChild(this.round, 1);
    },
    initBetPot(posX,posY,name,odds,eventBet,slot) {
		let pot = cc.Sprite.createWithSpriteFrameName("#frame.png");
		pot.setPosition(new cc.Point(posX,posY));
	    this.addChild(pot);
	    this.fxUI.push(pot);

		let label = cc.LabelTTF.create(name, "Roboto", 30);
	    label.setPosition(new cc.Point(posX,posY+55));
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
		var sprite = cc.Sprite.createWithSpriteFrameName("#"+spriteName+".png");
	    sprite.setPosition(new cc.Point(cc.winSize.width/2,cc.winSize.height/5*3));
	    this.addChild(sprite);
    },
    initBaccarat:function () {
    		this.initLogo('baccarat');
    	
    		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-218,cc.winSize.height/5,"BANKER","1.95",this.clickBet,0);
    		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+218,cc.winSize.height/5,"PLAYER","2",this.clickBet,1);
    		this.oddUI['bet2']['odd']	= this.initBetPot(cc.winSize.width/2,cc.winSize.height/5,"TIE","9",this.clickBet,2);
    		
    		this.oddUI['bet0']['point']	= cc.LabelTTF.create("", "Roboto", 30);
    		this.oddUI['bet0']['point'].setPosition(new cc.Point(cc.winSize.width/2-50,cc.winSize.height/2-30));
    		this.addChild(this.oddUI['bet0']['point']);
    		
    		this.oddUI['bet1']['point']	= cc.LabelTTF.create("", "Roboto", 30);
    		this.oddUI['bet1']['point'].setPosition(new cc.Point(cc.winSize.width/2+50,cc.winSize.height/2-30));
    		this.addChild(this.oddUI['bet1']['point']);
    		
    		// banker
    		var sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(new cc.Point(cc.winSize.width/2-258,cc.winSize.height/2-55));
    	    this.addChild(sprite);
    	
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(new cc.Point(cc.winSize.width/2-128,cc.winSize.height/2-55));
    	    this.addChild(sprite);
    	    
    	    // player
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(new cc.Point(cc.winSize.width/2+258,cc.winSize.height/2-55));
    	    this.addChild(sprite);
    	    
    	    // tie
    	    sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
    	    sprite.setPosition(new cc.Point(cc.winSize.width/2+128,cc.winSize.height/2-55));
    	    this.addChild(sprite);
    },
    initDragonTiger:function () {
    		this.initLogo('dragontiger');
    	
		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-218,cc.winSize.height/5,"DRAGON","2",this.clickBet,0);
		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+218,cc.winSize.height/5,"TIGER","2",this.clickBet,1);
		this.oddUI['bet2']['odd']	= this.initBetPot(cc.winSize.width/2,cc.winSize.height/5,"TIE","9",this.clickBet,2);
		
		this.oddUI['bet0']['point']	= cc.LabelTTF.create("", "Roboto", 30);
		this.oddUI['bet0']['point'].setPosition(new cc.Point(cc.winSize.width/2-50,cc.winSize.height/2-30));
		this.addChild(this.oddUI['bet0']['point']);
		
		this.oddUI['bet1']['point']	= cc.LabelTTF.create("", "Roboto", 30);
		this.oddUI['bet1']['point'].setPosition(new cc.Point(cc.winSize.width/2+50,cc.winSize.height/2-30));
		this.addChild(this.oddUI['bet1']['point']);

		// dragon
        var sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2-109,cc.winSize.height/2-55));
        this.addChild(sprite);

        // tiger
        sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2+109,cc.winSize.height/2-55));
        this.addChild(sprite);
    },
    initHighLow:function () {
    		this.initLogo('highlow');
    	
		this.oddUI['bet0']['odd']	= this.initBetPot(cc.winSize.width/2-218,cc.winSize.height/5,"HIGH","1",this.clickBet,0);
		this.oddUI['bet1']['odd']	= this.initBetPot(cc.winSize.width/2+218,cc.winSize.height/5,"LOW","1",this.clickBet,1);
		
		// 1st
        let sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2-109,cc.winSize.height/2-55));
        this.addChild(sprite);

        // 2nd
        sprite = cc.Sprite.createWithSpriteFrameName("#cardposition.png");
        sprite.setPosition(new cc.Point(cc.winSize.width/2+109,cc.winSize.height/2-55));
        this.addChild(sprite);    	
    },
    clickBet:function (that,slot,multi) {
    		console.log("bet"+slot+"x"+multi);
    }
});
