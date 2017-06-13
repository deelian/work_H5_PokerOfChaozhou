var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var ChatItemBoxUI=(function(_super){
		function ChatItemBoxUI(){
			
		    this.selfBox=null;
		    this.selfText=null;
		    this.selfNameLab=null;
		    this.playerBox=null;
		    this.playerText=null;
		    this.playerNameLab=null;

			ChatItemBoxUI.__super.call(this);
		}

		CLASS$(ChatItemBoxUI,'ui.Boxs.ChatItemBoxUI',_super);
		var __proto__=ChatItemBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ChatItemBoxUI.uiView);
		}

		STATICATTR$(ChatItemBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":350,"height":100},"child":[{"type":"Box","props":{"y":0,"x":0,"width":350,"var":"selfBox","height":99},"child":[{"type":"Label","props":{"y":35,"x":155,"wordWrap":true,"width":190,"var":"selfText","text":"ddd","height":12,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":10,"x":190,"wordWrap":true,"width":150,"var":"selfNameLab","text":"label","height":18,"fontSize":24,"color":"#ffb16c","align":"right"}}]},{"type":"Box","props":{"y":1,"x":0,"width":350,"var":"playerBox","height":99},"child":[{"type":"Label","props":{"y":36,"x":33,"wordWrap":true,"width":190,"var":"playerText","text":"label","height":12,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":8,"x":20,"wordWrap":true,"width":150,"var":"playerNameLab","text":"label","height":18,"fontSize":24,"color":"#ffb16c","align":"left"}}]}]};}
		]);
		return ChatItemBoxUI;
	})(View);
var EffortBoxUI=(function(_super){
		function EffortBoxUI(){
			
		    this.roundNumLab=null;
		    this.timeLab=null;
		    this.goldNumLab=null;
		    this.handIconLab=null;
		    this.touchBox=null;

			EffortBoxUI.__super.call(this);
		}

		CLASS$(EffortBoxUI,'ui.Boxs.EffortBoxUI',_super);
		var __proto__=EffortBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(EffortBoxUI.uiView);
		}

		STATICATTR$(EffortBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":787,"height":83},"child":[{"type":"Image","props":{"y":-3,"x":-2,"skin":"assets/ui.roomEffort/img_xinxidi.png"}},{"type":"Image","props":{"y":1,"x":85,"skin":"assets/ui.recordOfPoker/img_fengexian.png"}},{"type":"Image","props":{"y":-1,"x":679,"width":2,"skin":"assets/ui.recordOfPoker/img_fengexian.png","height":79}},{"type":"Label","props":{"y":21,"x":9,"var":"roundNumLab","text":"第1局","fontSize":23,"font":"Microsoft YaHei","color":"#e8dbc0"}},{"type":"Label","props":{"y":2,"x":685,"var":"timeLab","text":"16:47:15","fontSize":23,"font":"Microsoft YaHei","color":"#e8dbc0"}},{"type":"Label","props":{"y":43,"x":681,"width":102,"var":"goldNumLab","text":"+9999","height":36,"fontSize":18,"font":"Microsoft YaHei","color":"#e8dbc0","align":"center"}},{"type":"Box","props":{"y":1,"x":102,"width":575,"var":"handIconLab","height":76}},{"type":"Box","props":{"y":0,"x":0,"width":785,"var":"touchBox","height":86}}]};}
		]);
		return EffortBoxUI;
	})(View);
var EffortIconUI=(function(_super){
		function EffortIconUI(){
			
		    this.handIcon=null;
		    this.goldLab=null;
		    this.bankerTag=null;

			EffortIconUI.__super.call(this);
		}

		CLASS$(EffortIconUI,'ui.Boxs.EffortIconUI',_super);
		var __proto__=EffortIconUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(EffortIconUI.uiView);
		}

		STATICATTR$(EffortIconUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":55,"height":70},"child":[{"type":"Image","props":{"y":8,"x":4,"width":49,"var":"handIcon","skin":"assets/ui.room/img_head_icon.png","height":48},"child":[{"type":"Image","props":{"y":-1,"x":0,"width":50,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":50}}]},{"type":"Label","props":{"y":54,"x":3,"width":50,"var":"goldLab","text":"99999","height":17,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":5,"x":0,"width":18,"var":"bankerTag","skin":"assets/ui.room/icon_banker.png","height":18}}]};}
		]);
		return EffortIconUI;
	})(View);
var FinalItemUI=(function(_super){
		function FinalItemUI(){
			
		    this.playerInfo_0=null;
		    this.playerInfo_1=null;

			FinalItemUI.__super.call(this);
		}

		CLASS$(FinalItemUI,'ui.Boxs.FinalItemUI',_super);
		var __proto__=FinalItemUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(FinalItemUI.uiView);
		}

		STATICATTR$(FinalItemUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":800,"height":86,"fontSize":17},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.room/final/img_xinxidi.png"},"child":[{"type":"Box","props":{"var":"playerInfo_0"},"child":[{"type":"Image","props":{"y":8.000000000000004,"x":28.99999999999997,"width":50,"skin":"assets/ui.room/img_head_icon.png","name":"handIcon_0","height":50}},{"type":"Label","props":{"y":63,"x":7,"width":96,"text":"玩家名字七个字","name":"nameLab_0","height":17,"fontSize":13,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":7.000000000000012,"x":142.00000000000009,"text":"最大牌型","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":7.000000000000012,"x":234.00000000000003,"text":"天公次数","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":7.000000000000012,"x":329,"text":"最终积分","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":35.999999999999986,"x":109.00000000000001,"width":104,"name":"pokerBox_0","height":46}},{"type":"Label","props":{"y":43.999999999999986,"x":231,"width":58,"text":"999","name":"godNumLab_0","height":20,"fontSize":17,"font":"Microsoft YaHei","color":"#fec162","align":"center"}},{"type":"Label","props":{"y":44.99999999999998,"x":325.00000000000006,"width":58,"text":"999","name":"scoreLab_0","height":20,"fontSize":"17","font":"Microsoft YaHei","color":"#FF2626","align":"center"}},{"type":"Image","props":{"y":9,"x":4,"visible":false,"skin":"assets/ui.room/final/icon_fangzhu.png","name":"hostTag"}}]},{"type":"Image","props":{"y":4.999999999999985,"x":388.9999999999999,"skin":"assets/ui.room/final/img_fengexian.png"}},{"type":"Box","props":{"y":1,"x":406,"width":393,"var":"playerInfo_1","height":83},"child":[{"type":"Image","props":{"y":8.999999999999996,"x":13.000000000000057,"width":50,"skin":"assets/ui.room/img_head_icon.png","name":"handIcon_1","height":50}},{"type":"Label","props":{"y":64,"x":-9,"width":95,"text":"玩家名字七个字","name":"nameLab_1","height":18,"fontSize":13,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":8.000000000000004,"x":125.99999999999989,"text":"最大牌型","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8.000000000000004,"x":218,"text":"天公次数","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8.000000000000004,"x":313.0000000000001,"text":"最终积分","fontSize":13,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":36.99999999999998,"x":93,"width":104,"name":"pokerBox_1","height":46}},{"type":"Label","props":{"y":44.99999999999998,"x":215,"width":58,"text":"999","name":"godNumLab_1","height":20,"fontSize":"17","font":"Microsoft YaHei","color":"#fec162","align":"center"}},{"type":"Label","props":{"y":45.99999999999997,"x":308.9999999999999,"width":58,"text":"999","name":"scoreLab_1","height":20,"fontSize":17,"font":"Microsoft YaHei","color":"#FF2626","align":"center"}},{"type":"Image","props":{"y":12,"x":-11,"visible":false,"skin":"assets/ui.room/final/icon_fangzhu.png","name":"hostTag"}}]}]}]};}
		]);
		return FinalItemUI;
	})(View);
var LobbyEfforIconBoxUI=(function(_super){
		function LobbyEfforIconBoxUI(){
			
		    this.handIcon=null;
		    this.goldLab=null;
		    this.bankerTag=null;
		    this.idLab=null;
		    this.nameLab=null;

			LobbyEfforIconBoxUI.__super.call(this);
		}

		CLASS$(LobbyEfforIconBoxUI,'ui.Boxs.LobbyEfforIconBoxUI',_super);
		var __proto__=LobbyEfforIconBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyEfforIconBoxUI.uiView);
		}

		STATICATTR$(LobbyEfforIconBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":85,"height":144},"child":[{"type":"Image","props":{"y":3,"x":10,"width":71,"var":"handIcon","skin":"assets/ui.room/img_head_icon.png","height":71},"child":[{"type":"Image","props":{"y":0,"x":0,"width":72,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":72}}]},{"type":"Image","props":{"y":2,"x":8,"width":75,"skin":"assets/ui.room/img_head.png","height":74}},{"type":"Label","props":{"y":122,"x":17,"width":58,"var":"goldLab","text":"99999","height":17,"fontSize":16,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":0,"x":3,"width":30,"var":"bankerTag","skin":"assets/ui.room/icon_banker.png","height":30}},{"type":"Label","props":{"y":100,"x":7,"width":79,"var":"idLab","text":"99999","height":20,"fontSize":16,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":75,"x":4,"width":78,"var":"nameLab","text":"我的名字","height":20,"fontSize":16,"font":"Microsoft YaHei","color":"#f9ac79","align":"center"}}]};}
		]);
		return LobbyEfforIconBoxUI;
	})(View);
var LobbyEffortItemBoxUI=(function(_super){
		function LobbyEffortItemBoxUI(){
			
		    this.modeType=null;
		    this.playerBox=null;
		    this.clockLab=null;
		    this.dayLab=null;
		    this.roundLab=null;
		    this.roomIdLab=null;
		    this.touchBox=null;

			LobbyEffortItemBoxUI.__super.call(this);
		}

		CLASS$(LobbyEffortItemBoxUI,'ui.Boxs.LobbyEffortItemBoxUI',_super);
		var __proto__=LobbyEffortItemBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyEffortItemBoxUI.uiView);
		}

		STATICATTR$(LobbyEffortItemBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1068,"height":156},"child":[{"type":"Image","props":{"y":0,"x":1,"width":1066,"skin":"assets/ui.lobbyEffort/img_xinxidi.png","height":155}},{"type":"Image","props":{"y":102,"x":16,"width":204,"var":"modeType","skin":"assets/ui.button/img_jingdian.png","scaleY":0.5,"scaleX":0.5,"height":86}},{"type":"Box","props":{"y":8,"x":156,"width":920,"var":"playerBox","height":136}},{"type":"Label","props":{"y":75,"x":85,"width":43,"var":"clockLab","text":"16:47","height":20,"fontSize":16,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":75,"x":2,"width":67,"var":"dayLab","text":"05月01日","height":20,"fontSize":16,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":46,"x":19,"width":92,"var":"roundLab","text":"10/10局","height":23,"fontSize":16,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":21,"x":71,"width":65,"var":"roomIdLab","text":"0121313","height":20,"fontSize":16,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Box","props":{"y":14,"x":17,"width":1046,"var":"touchBox","height":131}},{"type":"Label","props":{"y":17,"x":20,"width":48,"text":"房号：","height":22,"fontSize":16,"font":"Microsoft YaHei","color":"#ffffff"}}]};}
		]);
		return LobbyEffortItemBoxUI;
	})(View);
var NewsBoxUI=(function(_super){
		function NewsBoxUI(){
			
		    this.newTag=null;
		    this.titleLab=null;
		    this.descLab=null;
		    this.touchBox=null;

			NewsBoxUI.__super.call(this);
		}

		CLASS$(NewsBoxUI,'ui.Boxs.NewsBoxUI',_super);
		var __proto__=NewsBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NewsBoxUI.uiView);
		}

		STATICATTR$(NewsBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":682,"height":85},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.news/bg_01.png"}},{"type":"Image","props":{"y":6,"x":661,"var":"newTag","skin":"assets/ui.news/img_Unread.png"}},{"type":"Label","props":{"y":30,"x":25,"width":168,"var":"titleLab","text":"这个是标题","height":23,"fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":28,"x":205,"width":431,"var":"descLab","text":"这个是标题","height":31,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":6,"x":7,"width":669,"var":"touchBox","height":74}}]};}
		]);
		return NewsBoxUI;
	})(View);
var RecordPokerBoxUI=(function(_super){
		function RecordPokerBoxUI(){
			
		    this.nameLab=null;
		    this.userIdLab=null;
		    this.typeLab=null;
		    this.goldLab=null;
		    this.pokerBox=null;
		    this.handIcon=null;
		    this.bankerTag=null;
		    this.bidRateLab=null;

			RecordPokerBoxUI.__super.call(this);
		}

		CLASS$(RecordPokerBoxUI,'ui.Boxs.RecordPokerBoxUI',_super);
		var __proto__=RecordPokerBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RecordPokerBoxUI.uiView);
		}

		STATICATTR$(RecordPokerBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":696,"height":85},"child":[{"type":"Image","props":{"y":1,"x":0,"skin":"assets/ui.recordOfPoker/img_xinxidi.png"},"child":[{"type":"Image","props":{"y":3,"x":520,"skin":"assets/ui.recordOfPoker/img_fengexian.png"}},{"type":"Label","props":{"y":13,"x":94,"width":159,"var":"nameLab","text":"玩家名字七个字","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":45,"x":95,"width":149,"var":"userIdLab","text":"ID:123456","height":29,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":28,"x":432,"width":83,"var":"typeLab","text":"同花顺","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":26,"x":607,"width":80,"var":"goldLab","text":"+9999","height":35,"fontSize":23,"font":"Microsoft YaHei","color":"#7fff5c","align":"center"}},{"type":"Box","props":{"y":6,"x":256,"width":183,"var":"pokerBox","height":74}},{"type":"Image","props":{"y":7,"x":6,"width":71,"var":"handIcon","skin":"assets/ui.room/img_head_icon.png","height":68},"child":[{"type":"Image","props":{"y":-1,"x":0,"width":70,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":70}}]},{"type":"Image","props":{"y":3,"x":60,"width":27,"var":"bankerTag","skin":"assets/ui.room/icon_banker.png","height":27}},{"type":"Label","props":{"y":26,"x":525,"width":77,"var":"bidRateLab","text":"x99","height":35,"fontSize":23,"font":"Microsoft YaHei","color":"#ffcd64","align":"center"}}]}]};}
		]);
		return RecordPokerBoxUI;
	})(View);
var RoomEffortBoxUI=(function(_super){
		function RoomEffortBoxUI(){
			
		    this.line=null;
		    this.roundLab=null;

			RoomEffortBoxUI.__super.call(this);
		}

		CLASS$(RoomEffortBoxUI,'ui.Boxs.RoomEffortBoxUI',_super);
		var __proto__=RoomEffortBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RoomEffortBoxUI.uiView);
		}

		STATICATTR$(RoomEffortBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":721,"height":89},"child":[{"type":"Box","props":{"y":1,"x":12,"width":707,"var":"line","height":84},"child":[{"type":"Image","props":{"y":-1,"x":-7,"width":711,"skin":"assets/ui.effortOfRoomRound/img_xinxidi.png","height":87}},{"type":"Image","props":{"y":5,"x":350,"skin":"assets/ui.effortOfRoomRound/img_fengexian.png"}},{"type":"Box","props":{"visible":false,"name":"userBox_0"},"child":[{"type":"Image","props":{"y":7,"x":6,"width":144,"skin":"assets/ui.room/img_head_icon.png","scaleY":0.5,"scaleX":0.5,"name":"handIcon","height":144},"child":[{"type":"Image","props":{"width":144,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":144}}]},{"type":"Image","props":{"y":3,"x":57,"skin":"assets/ui.room/icon_banker.png","name":"bankerTag"}},{"type":"Label","props":{"y":3,"x":94,"text":"玩家名字七个字","name":"nameLab","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":27,"x":92,"width":125,"name":"pokerBox","height":57}},{"type":"Label","props":{"y":15,"x":235,"text":"下注","name":"labText","fontSize":14,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":51,"x":226,"width":45,"text":"x5","name":"bidRateLab","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#ffd064","align":"center"}},{"type":"Label","props":{"y":51,"x":284,"width":60,"text":"+999","name":"scoreLab","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":15,"x":295,"text":"总积分","name":"textLab","fontSize":14,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":0,"x":355,"width":347,"visible":false,"name":"userBox_1","height":84},"child":[{"type":"Image","props":{"y":7,"x":8,"width":144,"skin":"assets/ui.room/img_head_icon.png","scaleY":0.5,"scaleX":0.5,"name":"handIcon","height":144},"child":[{"type":"Image","props":{"width":144,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":144}}]},{"type":"Label","props":{"y":3,"x":93,"text":"玩家名字七个字","name":"nameLab","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":51,"x":283,"width":57,"text":"+999","name":"scoreLab","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":27,"x":93,"width":125,"name":"pokerBox","height":57}},{"type":"Label","props":{"y":51,"x":227,"width":48,"text":"x5","name":"bidRateLab","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#ffd064","align":"center"}},{"type":"Label","props":{"y":15,"x":235,"text":"下注","name":"labText","fontSize":14,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":15,"x":291,"text":"总积分","name":"textLab","fontSize":14,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":4,"x":60,"skin":"assets/ui.room/icon_banker.png","name":"bankerTag"}}]}]},{"type":"Label","props":{"y":32,"x":273,"width":173,"var":"roundLab","text":"第几局","height":32,"fontSize":25,"font":"Microsoft YaHei","color":"#ffda7c","align":"center"}}]};}
		]);
		return RoomEffortBoxUI;
	})(View);
var RoomPlayerUI=(function(_super){
		function RoomPlayerUI(){
			
		    this.headTouch=null;
		    this.goldLab=null;
		    this.nameLab=null;
		    this.balanceLab=null;
		    this.bidRate=null;
		    this.bidRateLab=null;
		    this.bettingLab=null;
		    this.positivePokerBox=null;
		    this.selfShowPokerBg=null;
		    this.pokerBox=null;
		    this.showPokerNode=null;
		    this.readyIcon=null;
		    this.afkTag=null;
		    this.rubbedTag=null;

			RoomPlayerUI.__super.call(this);
		}

		CLASS$(RoomPlayerUI,'ui.Boxs.RoomPlayerUI',_super);
		var __proto__=RoomPlayerUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RoomPlayerUI.uiView);
		}

		STATICATTR$(RoomPlayerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":180,"height":150},"child":[{"type":"Image","props":{"y":8,"x":39,"width":107,"var":"headTouch","skin":"assets/ui.room/img_head_icon.png","height":107},"child":[{"type":"Image","props":{"y":-1,"x":1,"width":106,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":106}}]},{"type":"Image","props":{"y":6,"x":37,"width":111,"skin":"assets/ui.room/img_head.png","height":110}},{"type":"Label","props":{"y":42.99999999999999,"x":64,"width":0,"var":"goldLab","height":0,"fontSize":25,"font":"Microsoft YaHei"}},{"type":"Image","props":{"y":103,"x":33,"width":126,"skin":"assets/ui.room/img_0002.png","height":43},"child":[{"type":"Label","props":{"y":0,"x":-4,"width":134,"var":"nameLab","text":"名字是七个字的","height":25,"fontSize":17,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":19,"x":1,"width":118,"var":"balanceLab","text":"10000","height":21,"fontSize":18,"font":"Microsoft YaHei","color":"#f8c373","align":"center"}}]},{"type":"Image","props":{"y":25,"x":148,"visible":false,"var":"bidRate","skin":"assets/ui.room/img_RateBase.png"},"child":[{"type":"Label","props":{"y":1,"x":-6,"wordWrap":true,"width":66,"var":"bidRateLab","text":"x4","height":27,"fontSize":18,"font":"Microsoft YaHei","color":"#fcfc7a","bold":false,"align":"center"}},{"type":"Image","props":{"y":6,"x":4,"width":45,"visible":false,"var":"bettingLab","skin":"assets/ui.room/img_bet.png","height":16}}]},{"type":"Box","props":{"y":70,"x":-120,"width":163,"var":"positivePokerBox","height":110},"child":[{"type":"Image","props":{"visible":false,"var":"selfShowPokerBg","skin":"assets/ui.room/img_Settlement_4.png"}}]},{"type":"Box","props":{"y":92,"x":-23,"width":59,"var":"pokerBox","height":56}},{"type":"Box","props":{"y":54,"x":92,"width":125,"var":"showPokerNode","height":76,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":48,"x":42,"width":104,"visible":false,"var":"readyIcon","skin":"assets/ui.room/img_0002.png","height":35},"child":[{"type":"Image","props":{"y":2.999999999999943,"x":21,"skin":"assets/ui.room/img_Ready.png"}}]},{"type":"Sprite","props":{"y":27,"x":150,"name":"labPosLeft"}},{"type":"Sprite","props":{"y":146,"x":68,"name":"labPosBottom"}},{"type":"Sprite","props":{"y":-20,"x":81,"name":"labPosTop"}},{"type":"Sprite","props":{"y":26,"x":-26,"name":"labPosRight"}},{"type":"Sprite","props":{"y":108,"x":-28,"name":"labPosBottomRight"}},{"type":"Sprite","props":{"y":108,"x":162,"name":"labPosBottomLeft"}},{"type":"Sprite","props":{"y":92,"x":-23,"name":"handPokerPosLeft"}},{"type":"Sprite","props":{"y":92,"x":102,"name":"handPokerPosRight"}},{"type":"Image","props":{"y":48,"x":42,"width":104,"visible":false,"var":"afkTag","skin":"assets/ui.room/img_0002.png","height":35},"child":[{"type":"Image","props":{"y":3.999999999999943,"x":23,"skin":"assets/ui.room/img_leave.png"}}]},{"type":"Image","props":{"y":48,"x":43,"width":104,"visible":false,"var":"rubbedTag","skin":"assets/ui.room/img_0002.png","height":35},"child":[{"type":"Image","props":{"y":3.999999999999943,"x":11,"skin":"assets/ui.room/img_label_cuopaizhong.png"}}]}]};}
		]);
		return RoomPlayerUI;
	})(View);
var AgreementDialogUI=(function(_super){
		function AgreementDialogUI(){
			
		    this.textPanel=null;

			AgreementDialogUI.__super.call(this);
		}

		CLASS$(AgreementDialogUI,'ui.Dialogs.AgreementDialogUI',_super);
		var __proto__=AgreementDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(AgreementDialogUI.uiView);
		}

		STATICATTR$(AgreementDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":42,"x":99,"skin":"assets/ui.agreement/bg_jiemian.png"}},{"type":"Image","props":{"y":67,"x":461,"skin":"assets/ui.agreement/img_yhxy.png"}},{"type":"Button","props":{"y":43,"x":956,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":123,"x":130,"skin":"assets/ui.agreement/bg_01.png"}},{"type":"Panel","props":{"y":129,"x":137,"width":846,"var":"textPanel","height":433},"child":[{"type":"Label","props":{"y":4,"x":16,"wordWrap":true,"width":117,"text":"《健康游戏忠告》","height":23,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":31,"x":16,"wordWrap":true,"width":822,"text":"抵制不良游戏，拒绝盗版游戏。注意用户安全，谨防上当受骗。适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活，倡导理性消费享受竞技快乐。 严禁恶意利用本游戏进行赌博等违法犯罪行为，一经发现，立即停封账号、并向公安机关举报。","leading":8,"height":45,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":107,"x":16,"wordWrap":true,"width":822,"text":"欢迎使用橄榄欢乐木虱游戏服务，请您（以下可称“用户”或“您”）仔细阅读以下条款；如果您未满18周岁，请在法定监护人的陪同下阅读本协议。本协议系您与橄榄欢乐木虱之间就《橄榄欢乐木虱》（下称本游戏）所订立的权利义务规范。如果您对本协议的任何条款及／或橄榄欢乐木虱随时对其的修改表示异议，您可以选择不进入本游戏；进入本游戏或使用橄榄欢乐木虱服务，则意味着您同意遵守本协议全部约定，包括橄榄欢乐木虱对本协议随时所做的任何修改，并完全服从橄榄欢乐木虱的统一管理。","leading":8,"height":97,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":229,"x":16,"wordWrap":true,"width":822,"text":"１.１本协议：指本协议正文及修订版本、本游戏的规则及修订版本。本协议同时还包括文化部依据《网络游戏管理暂行办法》（文化部令第４９号）制定的《网络游戏服务格式化协议必备条款》（详见附录）","leading":8,"height":44,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":276,"x":16,"wordWrap":true,"width":822,"text":"１.２游戏规则：指橄榄欢乐木虱游戏不时发布并修订的关于游戏的用户协议、游戏规则、游戏公告及通知、指引、说明等内容。","leading":8,"height":25,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":300,"x":16,"wordWrap":true,"width":822,"text":"１.３您：又称“玩家”或“用户”，指接受橄榄欢乐木虱游戏服务的自然人。","leading":8,"height":25,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":326,"x":16,"wordWrap":true,"width":822,"text":"１.４游戏数据：指您在使用橄榄欢乐木虱游戏服务过程中产生的并储存于服务器的各种数据信息，包括游戏日志、安全日志等。","leading":8,"height":25,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":350,"x":16,"wordWrap":true,"width":822,"text":"１.５房卡：您进入并使用本游戏服务所需购买、消耗的游戏卡。房卡不可在玩家间交易，不能与游戏中的积分相兑换，仅使用与进入并使用本游戏。","leading":8,"height":41,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":400,"x":16,"wordWrap":true,"width":822,"text":"二、账号","leading":8,"height":28,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":421,"x":16,"wordWrap":true,"width":822,"text":"２.１本游戏暂时仅通过微信验证登录，未来不排除将引入其他第三方账户体系用于登录本游戏。请您妥善保管您的各类账户和密码，确保账户安全。如您将账户、密码转让、出售或出借予他人使用，或授权他人使用账号，应对授权人在该账号下发生所有行为负全部责任，橄榄欢乐木虱游戏对您前述行为所造成的任何后果，不承担任何法律责任。","leading":8,"height":61,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":488,"x":16,"wordWrap":true,"width":822,"text":"２.２如果橄榄欢乐木虱游戏在今后自建立账号体系，则账号的所有权归橄榄欢乐木虱游戏，您在完成注册申请手续后，仅获得橄榄欢乐木虱游戏账号的使用权。您应提供及时、详尽及准确的个人资料，并不断更新注册信息。因注册信息不真实而导致的问题及后果，橄榄欢乐木虱游戏对此不负任何责任。因黑客行为等第三方因素或用户自身原因导致的账号安全问题，橄榄欢乐木虱游戏对受影响玩家不承担任何法律责任。","leading":8,"height":87,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":577,"x":16,"wordWrap":true,"width":822,"text":"２.３您应当通过真实身份信息认证注册账号，且您提交的账号名称、头像和简介等注册信息中不得出现违法和不良信息，经橄榄欢乐木虱游戏审核，如存在上述情况，橄榄欢乐木虱游戏将不予注册；同时，在注册后，如发现您以虚假信息骗取账号名称注册，或账号头像、简介等注册信息存在违法和不良信息的，橄榄欢乐木虱游戏有权不经通知单方采取限期改正、暂停使用、注销登记、收回等措施。","leading":8,"height":87,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":666,"x":16,"wordWrap":true,"width":822,"text":"２.４您如果需要使用和享受橄榄欢乐木虱游戏服务，您需要按照《网络游戏管理暂行规定》及文化部《网络游戏服务格式化协议必备条款》的要求，登记实名注册系统并进行实名注册。","leading":8,"height":44,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":712,"x":16,"wordWrap":true,"width":822,"text":"２.５如果您长期连续未登陆，您在游戏内的游戏数据可能会由于技术原因被删除，对此橄榄欢乐木虱游戏不承担任何责任。","leading":8,"height":26,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":741,"x":16,"wordWrap":true,"width":822,"text":"三、橄榄欢乐木虱游戏服务","leading":8,"height":26,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":769,"x":16,"wordWrap":true,"width":822,"text":"３.１橄榄欢乐木虱游戏将向您提供本游戏作为休闲娱乐之用，橄榄欢乐木虱游戏严禁一切形式的赌博和其他违法犯罪活动。请您适度游戏，橄榄欢乐木虱游戏将与您共同打造绿色的休闲平台。","leading":8,"height":43,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":814,"x":16,"wordWrap":true,"width":822,"text":"３.２在您遵守本协议及相关法律法规的前提下，橄榄欢乐木虱游戏将给予您一项不可转让及非排他性的许可，以使用橄榄欢乐木虱游戏服务。您使用橄榄欢乐木虱游戏服务仅可以非商业目的的使用，包括：","leading":8,"height":43,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":859,"x":16,"wordWrap":true,"width":822,"text":"（１）接收、下载、安装、启动、升级、登陆、显示、运行本游戏；","leading":8,"height":25,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":886,"x":16,"wordWrap":true,"width":822,"text":"２）创建游戏角色，设置角色名（本游戏暂不支持）；查阅本游戏规则、用户个人资料、游戏对局结果、开设游戏房间、设置游戏参数、使用聊天功能、社交分享功能；","leading":8,"height":43,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":931,"x":16,"wordWrap":true,"width":822,"text":"（３）使用本游戏支持并允许的其他某一项或几项功能；","leading":8,"height":22,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":955,"x":16,"wordWrap":true,"width":822,"text":"３.３您充分理解并同意：享受本游戏服务，需要购买并消耗房卡；房卡可通过线上途径购得；房卡使用期限为自您获得房卡之日起至游戏终止运营（无论何种原因导致运营终止）之日止；一旦购买房卡完成，除非橄榄欢乐木虱游戏同意，您将不得撤销交易或要求将所购房卡回兑成相应的现金或其他等价物。","leading":8,"height":66,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1024,"x":16,"wordWrap":true,"width":822,"text":"３.４本游戏暂不支持任何虚拟货币、虚拟物品等。","leading":8,"height":25,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1051,"x":16,"wordWrap":true,"width":822,"text":"３.５您在使用橄榄欢乐木虱游戏的收费功能时，应当按照橄榄欢乐木虱游戏的要求支付相应费用。该权利属于橄榄欢乐木虱游戏的经营自主权，橄榄欢乐木虱游戏保留随时改变经营模式的权利，既保留变更收费的费率标准、收费的软件功能、收费对象及收费时间等权利。同时，也保留对橄榄欢乐木虱游戏进行升级、改版、增加、删除、修改、变更功能或者变更游戏规则的权利；用户继续使用本游戏的行为，视为用户接受改变后的经营模式。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1141,"x":16,"wordWrap":true,"width":822,"text":"３.６为保障玩家的正当利益，橄榄欢乐木虱游戏对盗号及盗号相关行为（包括但不限于盗取账号、游戏数据、玩家个人资料、协助盗号者操作等）予以严厉打击和处罚。一经查证属实或应有关机关要求，橄榄欢乐木虱游戏有权视具体情况立即采取封号等处罚措施，情节严重的，橄榄欢乐木虱游戏互娱保留对涉案玩家追究法律责任的权利。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1209,"x":16,"wordWrap":true,"width":822,"text":"３.７如果橄榄欢乐木虱游戏互娱发现或收到他人举报或投诉用户违反本协议约定，经查证属实，橄榄欢乐木虱游戏互娱有权不经通知随时对相关内容进行删除，并视行为情节对违规账号处以包括但不限于警告、限制或禁止使用全部或部分功能、封号甚至终止服务的处罚。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1277,"x":16,"wordWrap":true,"width":822,"text":"３.８您充分理解并同意，因您违反本协议或相关规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；橄榄欢乐木虱游戏因此遭受损失的，您也一并赔偿。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1323,"x":16,"wordWrap":true,"width":822,"text":"３.９橄榄欢乐木虱游戏可能会通过官方网站、客服电话、微信公众号、游戏管理员或者其他的途径，向用户提供诸如游戏规则说明、ＢＵＧ或外挂投诉、游戏账号实名注册信息修改和查验等客户服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1370,"x":16,"wordWrap":true,"width":822,"text":"四、用户行为规范","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1394,"x":16,"wordWrap":true,"width":822,"text":"４.１您充分了解并同意，您必须为自己账号下的一切行为负责，包括您所发表的任何内容以及由此产生的任何后果。您对本游戏中的内容自行加以判断，并承担因使用本游戏而引起的所有风险，包括因对本游戏内容的正确性、完整性或实用性的依赖而产生的风险。橄榄欢乐木虱游戏无法且不会对因前述风险而导致的任何损失或损害承担责任。 ４.２除非法律允许或橄榄欢乐木虱游戏书面许可，您不得（营利或非营利性的）从事下列行为：","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1484,"x":16,"wordWrap":true,"width":822,"text":"（１）通过非橄榄欢乐木虱游戏开发、授权的第三方软件、插件、外挂、系统、使用本游戏及橄榄欢乐木虱游戏的其他服务；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1508,"x":16,"wordWrap":true,"width":822,"text":"（２）制作、发布、传播非橄榄欢乐木虱游戏开发、授权的第三方软件、插件、外挂、系统；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1532,"x":16,"wordWrap":true,"width":822,"text":"（３）建立有关橄榄欢乐木虱游戏的镜像站点，或者进行网页（络）快照，或者利用架设服务器等方式，为他人提供与本游戏服务完全相同或者类似的服务；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1578,"x":16,"wordWrap":true,"width":822,"text":"（４）对本游戏软件进行反向工程、反向汇编、反向编译或者以其他方式尝试获取软件的源代码；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1602,"x":16,"wordWrap":true,"width":822,"text":"（５）通过各种方式侵入游戏服务器，干扰服务器的正常运行，接触、拷贝、篡改、增加、删除游戏数据；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1627,"x":16,"wordWrap":true,"width":822,"text":"（６）使用橄榄欢乐木虱游戏的名称、商标或其他知识产权；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1651,"x":16,"wordWrap":true,"width":822,"text":"（７）其他未经橄榄欢乐木虱游戏明示授权的行为。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1675,"x":16,"wordWrap":true,"width":822,"text":"４.３您在使用本游戏服务过程中如有以下行为的，橄榄欢乐木虱游戏将视情节严重程度，依据本协议及相关有限规则的规定，对您暂时或永久性地作出禁言（关闭聊天功能）、强制离线、封号、（暂停游戏账户）、终止服务等处理措施，情节严重的将移交有关机关给予行政处罚，甚至向公安机关举报、追究您的刑事责任；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1743,"x":16,"wordWrap":true,"width":822,"text":"（１）假冒橄榄欢乐木虱游戏工作人员或其他客户服务人员；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1767,"x":16,"wordWrap":true,"width":822,"text":"（２）传播非法言论或不当信息，包括使用非法或不当词语、字符等用于角色命名；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1791,"x":16,"wordWrap":true,"width":822,"text":"（３）对橄榄欢乐木虱游戏工作人员或其他玩家进行辱骂、人身攻击等；不断吵闹、重复发言、不断发布广告、恶意刷屏等，以及恶意连续他人、影响他人游戏等其他行为；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1837,"x":16,"wordWrap":true,"width":822,"text":"（４）以任何方式破坏本游戏或影响本游戏服务的正常进行；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1862,"x":16,"wordWrap":true,"width":822,"text":"（５）各种非法外挂行为；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1886,"x":16,"wordWrap":true,"width":822,"text":"（６）利用系统ＢＵＧ、漏洞为自己及他人牟利；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1910,"x":16,"wordWrap":true,"width":822,"text":"（７）利用本游戏进行赌博；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1934,"x":16,"wordWrap":true,"width":822,"text":"（８）侵犯橄榄欢乐木虱游戏的知识产权，或者进行其他有损于本游戏或第三方合法权益的行为；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1958,"x":16,"wordWrap":true,"width":822,"text":"（９）通过各种方式侵入游戏服务器，干扰服务器的正常运行，接触、拷贝、篡改、增加、删除游戏数据；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":1982,"x":16,"wordWrap":true,"width":822,"text":"（１０）其他在行业内被广泛认可的不当行为，无论是否已经被协议或游戏规则明确列明。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2006,"x":16,"wordWrap":true,"width":822,"text":"五、免责声明","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2031,"x":16,"wordWrap":true,"width":822,"text":"５.１橄榄欢乐木虱游戏可能因游戏软件ＢＵＧ、版本更新缺陷、运营ＢＵＧ、第三方病毒攻击或其他任何因素导致您无法正常登陆账号，或导致您的游戏角色、游戏数据等账号发生异常。在数据异常的原因未得到查明前，橄榄欢乐木虱游戏有权暂时冻结该账号；若查明数据异常非正常游戏行为，您游戏账号数据将可能被恢复至异常发生前的原始状态，橄榄欢乐木虱游戏对此免责。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2099,"x":16,"wordWrap":true,"width":822,"text":"５.２对于您未经橄榄欢乐木虱游戏官方授权合作方处购买房卡行为，橄榄欢乐木虱游戏不承担任何责任，并且不受理因任何未经授权的第三方交易发生纠纷而带来的申诉。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2145,"x":16,"wordWrap":true,"width":822,"text":"５.３由于互联网服务的特殊性，橄榄欢乐木虱游戏有权根据法律法规的规定及相关主管部门的要求、第三方权利人的投诉举报、与合作方的合作情况，以及橄榄欢乐木虱游戏业务发展情况，随时变更、中断或终止本服务的部分或全部内容。本游戏终止运营后，橄榄欢乐木虱游戏将根据后台数据，向您退还剩余房卡或其他所购物品的费用。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2213,"x":16,"wordWrap":true,"width":822,"text":"六、知识产权","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2237,"x":16,"wordWrap":true,"width":822,"text":"６.１橄榄欢乐木虱游戏是本游戏的知识产权权利人。相关的著作权、商标权、专利权、商业秘密等知识产权，以及其他信息内容（包括文字、图片、音频、视频、图表、界面设计、版面框架、有关数据或电子文档等）均受中华人民共和国法律和相应国际条约保护，橄榄欢乐木虱游戏享有上述知识产权，但相关权利人依照法律规定应享有的权利除外。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2305,"x":16,"wordWrap":true,"width":822,"text":"６.２您在使用橄榄欢乐木虱游戏服务中产生的游戏数据的所有知识产权归橄榄欢乐木虱游戏所有，橄榄欢乐木虱游戏互娱有权处置该游戏数据。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2351,"x":16,"wordWrap":true,"width":822,"text":"６.３橄榄欢乐木虱游戏可能涉及第三方知识产权，而该等第三方对于您基于本协议在橄榄欢乐木虱游戏中使用该知识产权有要求的，您应当一并遵守。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2398,"x":16,"wordWrap":true,"width":822,"text":"七、用户信息收集、使用和保护","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2422,"x":16,"wordWrap":true,"width":822,"text":"７.１您同意并授权橄榄欢乐木虱游戏为履行本协议之目的收集您的用户信息，这些信息包括您在实名注册系统中注册的信息、您的账号下的游戏数据以及其他您在使用本游戏服务的过程中向橄榄欢乐木虱游戏提供的或橄榄欢乐木虱游戏基于安全、用户体验优化等考虑而需收集信息，橄榄欢乐木虱游戏对您的用户信息的收集将遵循相关法律的规定。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2490,"x":16,"wordWrap":true,"width":822,"text":"７.２您充分理解并同意： 为更好地向您提供橄榄欢乐木虱游戏服务，橄榄欢乐木虱游戏可以将您的用户信息提交给关联公司，且橄榄欢乐木虱游戏有权自行或通过第三方对您的用户信息进行整理、统计、分析和利用。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2536,"x":16,"wordWrap":true,"width":822,"text":"７.３您充分理解并同意：橄榄欢乐木虱游戏可以根据您的用户信息，通过短信、电话、邮件等各种方式向您提供关于橄榄欢乐木虱游戏的活动信息、推广信息等各类信息。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2582,"x":16,"wordWrap":true,"width":822,"text":"７.４橄榄欢乐木虱游戏保证不对外公开或者向任何第三方提供您的个人信息，但是存在下列情形之一的除外：","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2606,"x":16,"wordWrap":true,"width":822,"text":"（１）公开或提供相关信息之前获得您的许可的；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2631,"x":16,"wordWrap":true,"width":822,"text":"（２）根据法律或政策的规定而公开或提供的；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2655,"x":16,"wordWrap":true,"width":822,"text":"（３）只有公开或提供您的个人信息，才能向您提供您需要的橄榄欢乐木虱游戏服务的；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2679,"x":16,"wordWrap":true,"width":822,"text":"（４）根据国际权利机关要求公开或提供的。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2703,"x":16,"wordWrap":true,"width":822,"text":"八、管辖与法律适用","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2727,"x":16,"wordWrap":true,"width":822,"text":"８.１本协议签订地为中华人民共和国广东省广州市。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2751,"x":16,"wordWrap":true,"width":822,"text":"８.２本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2775,"x":16,"wordWrap":true,"width":822,"text":"８.３若您和橄榄欢乐木虱游戏之间因本协议发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交至橄榄欢乐木虱游戏住所地有管辖权的人民法院管辖。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2822,"x":16,"wordWrap":true,"width":822,"text":"九、协议的变更和生效","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2846,"x":16,"wordWrap":true,"width":822,"text":"９.１橄榄欢乐木虱游戏有权根据需要不时修订本协议条款。上述内容一经正式公布即生效。您可以在橄榄欢乐木虱游戏的相关页面查阅最新版本的协议条款。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2892,"x":16,"wordWrap":true,"width":822,"text":"９.２本协议条款变更后，如果您继续使用本游戏服务，即视为您已接受变更后的协议。如果您不接受变更后的协议，应当立即停止使用本游戏的服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2938,"x":16,"wordWrap":true,"width":822,"text":"９.３出发本洗衣另有其他明示规定，橄榄欢乐木虱游戏所推出的新产品、新功能、新服务，均受到本协议之规范。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2989,"x":16,"wordWrap":true,"width":822,"text":"附录《网络游戏服务格式化协议必备条款》","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3019,"x":16,"wordWrap":true,"width":822,"text":"１.账号注册","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3044,"x":16,"wordWrap":true,"width":822,"text":"１.１乙方承诺以其真实身份注册为甲方的用户，并保证所提供的个人身份资料信息真实、完整、有效、依据法律规定和必备条款约定对所提供的信息承担相应的法律责任。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3096,"x":16,"wordWrap":true,"width":822,"text":"１.２乙方以其真实身份注册成为甲方用户后，需要修改所提供的个人身份资料信息的，甲方应当及时、有效地为其提供该项服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3125,"x":16,"wordWrap":true,"width":822,"text":"２用户账号使用与保管","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3155,"x":16,"wordWrap":true,"width":822,"text":"２.１根据必备条款的约定，甲方有权审查乙方注册所提供的身份信息是否真实、有效，并应积极地采取技术与管理等合理措施保障用户账号的安全、有效；乙方有义务妥善保管其账号及密码，并正确、安全地使用其账号及密码。任何一方未尽上述义务导致账号密码遗失、账号被盗等情形而给乙方和他人的民事权利造成损害的，应当承担由此产生的法律责任。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3228,"x":16,"wordWrap":true,"width":822,"text":"２.２乙方对登陆后所持账号产生的行为依法享有权利和承担责任。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3258,"x":16,"wordWrap":true,"width":822,"text":"２.３乙方发现其账号或密码被他人非法使用或有使用异常的情况的，应及时根据甲方公布的处理方式通知甲方，并有权通知甲方采取措施暂停该账号的登录和使用。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3310,"x":16,"wordWrap":true,"width":822,"text":"２.４甲方根据乙方的通知采取措施暂停乙方账号的登陆和使用的，甲方应当要求乙方提供并核实与其注册身份信息相一致的个人有效身份信息。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3361,"x":16,"wordWrap":true,"width":822,"text":"２.４.１甲方核实乙方所提供的个人有效身份信息与所注册的身份信息相一致的，应当及时采取措施暂停乙方账号的登陆和使用。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3391,"x":16,"wordWrap":true,"width":822,"text":"２.４.２甲方违反２.４.１款项的约定，未及时采取措施暂停乙方账号的登陆和使用，因此而给乙方造成损失的，应当承担其相应的法律责任。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3443,"x":16,"wordWrap":true,"width":822,"text":"２.４.３乙方没有提供其个人有效身份证件或者乙方提供的个人有效身份证件与所注册的身份信息不一致的，甲方有权拒绝乙方上述请求。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3494,"x":16,"wordWrap":true,"width":822,"text":"２.５乙方为了维护其合法权益，向甲方提供与所注册的身份信息相一致的个人有效身份信息时，甲方应当为乙方提供账号注册人证明、原始注册信息等必要的协助和支持，并根据需要向有关行政机关和司法机关提供相关证据信息资料。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3546,"x":16,"wordWrap":true,"width":822,"text":"３.服务的中止与终止","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3575,"x":16,"wordWrap":true,"width":822,"text":"３.１乙方有发布违法信息、严重违背社会公德、以及其他违反法律禁止性规定的行为，严重违背社会公德、以及其他违反法律禁止性规定的行为，甲方应当立即终止对乙方提供服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3627,"x":16,"wordWrap":true,"width":822,"text":"３.２乙方在接受甲方服务时实施不正当行为的，甲方有权终止对乙方提供服务。该不正当行为的具体情形应当在本协议中有明确约定或属于甲方事先明确告知的应被终止的禁止性行为，否则，甲方不得终止对乙方提供服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3679,"x":16,"wordWrap":true,"width":822,"text":"３.３乙方提供虚假注册身份信息，或实施违反本协议的行为，甲方有权中止对乙方提供全部或部分服务；甲方采取中止措施应当通知乙方并告知中止期间，中止期间应该合理的，中止期间届满甲方应当及时恢复对甲方的服务。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3730,"x":16,"wordWrap":true,"width":822,"text":"３.４甲方根据本条约定中止或终止对乙方提供部分或全部服务的，甲方应负举证责任。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3760,"x":16,"wordWrap":true,"width":822,"text":"４.用户信息保护","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3790,"x":16,"wordWrap":true,"width":822,"text":"４.１甲方要求乙方提供与其个人身份有关的信息资料时，应当事先以明确而易见的方式向乙方公开其隐私权保护政策和个人信息利用政策，并采取必要措施保护乙方的个人信息资料的安全。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3841,"x":16,"wordWrap":true,"width":822,"text":"４.２.１乙方或乙方监护人授权甲方披露；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3871,"x":16,"wordWrap":true,"width":822,"text":"４.２.２有关法律要求甲方披露；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3900,"x":16,"wordWrap":true,"width":822,"text":"４.２.４甲方为了维护自己合法权益而向乙方提起诉讼或者仲裁时；","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":3930,"x":16,"wordWrap":true,"width":822,"text":"４.２.５应乙方监护人的合法要求而提供乙方个人信息时。","leading":8,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff"}}]}]};}
		]);
		return AgreementDialogUI;
	})(Dialog);
var ConnectDialogUI=(function(_super){
		function ConnectDialogUI(){
			
		    this.message=null;

			ConnectDialogUI.__super.call(this);
		}

		CLASS$(ConnectDialogUI,'ui.Dialogs.ConnectDialogUI',_super);
		var __proto__=ConnectDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ConnectDialogUI.uiView);
		}

		STATICATTR$(ConnectDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"y":0,"x":0,"width":1136,"height":640},"child":[{"type":"Image","props":{"y":320,"x":568,"skin":"assets/ui.tip/bg_01.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":320,"x":568,"wordWrap":true,"width":460,"var":"message","valign":"middle","text":"正在初始化网络","height":140,"fontSize":28,"color":"#f6ecec","anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return ConnectDialogUI;
	})(Dialog);
var LoadingAniDialogUI=(function(_super){
		function LoadingAniDialogUI(){
			

			LoadingAniDialogUI.__super.call(this);
		}

		CLASS$(LoadingAniDialogUI,'ui.Dialogs.LoadingAniDialogUI',_super);
		var __proto__=LoadingAniDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoadingAniDialogUI.uiView);
		}

		STATICATTR$(LoadingAniDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640}};}
		]);
		return LoadingAniDialogUI;
	})(Dialog);
var InputRoomNumDialogUI=(function(_super){
		function InputRoomNumDialogUI(){
			
		    this.keyBoardBox=null;
		    this.reInputBtn=null;
		    this.deleteBtn=null;
		    this.numBox=null;

			InputRoomNumDialogUI.__super.call(this);
		}

		CLASS$(InputRoomNumDialogUI,'ui.Dialogs.Lobby.InputRoomNumDialogUI',_super);
		var __proto__=InputRoomNumDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(InputRoomNumDialogUI.uiView);
		}

		STATICATTR$(InputRoomNumDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":56,"x":244,"skin":"assets/ui.inputRoom/img_jiemian.png","mouseEnabled":true}},{"type":"Image","props":{"y":148,"x":310,"skin":"assets/ui.inputRoom/img_01.png"}},{"type":"Label","props":{"y":153,"x":494,"width":147,"text":"请输入房间号","height":35,"fontSize":24,"font":"Microsoft YaHei","color":"#7fff5c"}},{"type":"Box","props":{"y":249,"x":346,"width":451,"var":"keyBoardBox","height":267},"child":[{"type":"Button","props":{"y":13,"x":1,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_1"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0012_1.png"}}]},{"type":"Button","props":{"y":13,"x":156,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_2"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0011_2.png"}}]},{"type":"Button","props":{"y":12,"x":311,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_3"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0010_3.png"}}]},{"type":"Button","props":{"y":78,"x":1,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_4"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0009_4.png"}}]},{"type":"Button","props":{"y":79,"x":156,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_5"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0008_5.png"}}]},{"type":"Button","props":{"y":79,"x":311,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_6"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0007_6.png"}}]},{"type":"Button","props":{"y":145,"x":1,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_7"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0006_7.png"}}]},{"type":"Button","props":{"y":145,"x":156,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_8"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0005_8.png"}}]},{"type":"Button","props":{"y":145,"x":311,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_9"},"child":[{"type":"Image","props":{"y":9,"x":53,"skin":"assets/ui.inputRoom/_0004_9.png"}}]},{"type":"Button","props":{"y":209,"x":1,"var":"reInputBtn","stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png"},"child":[{"type":"Image","props":{"y":9,"x":28,"skin":"assets/ui.inputRoom/img_chongshu.png"}}]},{"type":"Button","props":{"y":211,"x":156,"stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png","name":"num_0"},"child":[{"type":"Image","props":{"y":9,"x":50,"skin":"assets/ui.inputRoom/_0003_0.png"}}]},{"type":"Button","props":{"y":209,"x":311,"var":"deleteBtn","stateNum":"2","skin":"assets/ui.inputRoom/btn_shuzi.png"},"child":[{"type":"Image","props":{"y":9,"x":32,"skin":"assets/ui.inputRoom/img_del.png"}}]}]},{"type":"Button","props":{"y":59,"x":834,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":80,"x":499,"skin":"assets/ui.inputRoom/img_jiarufangjian.png"}},{"type":"Box","props":{"y":190,"x":345,"width":442,"var":"numBox","height":62},"child":[{"type":"Image","props":{"y":50,"x":12,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Image","props":{"y":50,"x":85,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Image","props":{"y":50,"x":159,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Image","props":{"y":50,"x":232,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Image","props":{"y":50,"x":307,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Image","props":{"y":50,"x":380,"skin":"assets/ui.inputRoom/img_shuzidi.png"}},{"type":"Label","props":{"y":9,"x":27,"name":"roomNum_0","fontSize":36,"color":"#ffffff"}},{"type":"Label","props":{"y":9,"x":99,"name":"roomNum_1","fontSize":36,"color":"#ffffff"}},{"type":"Label","props":{"y":9,"x":174,"name":"roomNum_2","fontSize":36,"color":"#ffffff"}},{"type":"Label","props":{"y":9,"x":250,"name":"roomNum_3","fontSize":36,"color":"#ffffff"}},{"type":"Label","props":{"y":9,"x":321,"name":"roomNum_4","fontSize":36,"color":"#ffffff"}},{"type":"Label","props":{"y":9,"x":395,"name":"roomNum_5","fontSize":36,"color":"#ffffff"}}]}]};}
		]);
		return InputRoomNumDialogUI;
	})(Dialog);
var LobbyEffortDialogUI=(function(_super){
		function LobbyEffortDialogUI(){
			
		    this.effortBox=null;

			LobbyEffortDialogUI.__super.call(this);
		}

		CLASS$(LobbyEffortDialogUI,'ui.Dialogs.Lobby.LobbyEffortDialogUI',_super);
		var __proto__=LobbyEffortDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyEffortDialogUI.uiView);
		}

		STATICATTR$(LobbyEffortDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":36,"x":5,"skin":"assets/ui.lobbyEffort/bg_jiemian.png","mouseEnabled":true}},{"type":"Button","props":{"y":38,"x":1072,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":51,"x":516,"skin":"assets/ui.lobbyEffort/img_zongzhanji.png"}},{"type":"Box","props":{"y":121,"x":31,"width":1082,"var":"effortBox","height":467}}]};}
		]);
		return LobbyEffortDialogUI;
	})(Dialog);
var NewsDescDialogUI=(function(_super){
		function NewsDescDialogUI(){
			
		    this.titleLab=null;
		    this.timeLab=null;
		    this.descLab=null;

			NewsDescDialogUI.__super.call(this);
		}

		CLASS$(NewsDescDialogUI,'ui.Dialogs.Lobby.NewsDescDialogUI',_super);
		var __proto__=NewsDescDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NewsDescDialogUI.uiView);
		}

		STATICATTR$(NewsDescDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":122,"x":265,"skin":"assets/ui.news/bg_box.png"}},{"type":"Button","props":{"y":121,"x":832,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Label","props":{"y":150,"x":391,"width":407,"var":"titleLab","text":"这个还是标题","height":31,"fontSize":24,"font":"Microsoft YaHei","color":"#ffb66c","align":"center"}},{"type":"Label","props":{"y":188,"x":391,"width":407,"var":"timeLab","text":"这个是时间","height":31,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":229,"x":317,"wordWrap":true,"width":525,"var":"descLab","text":"这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间这个是时间","leading":8,"height":192,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]};}
		]);
		return NewsDescDialogUI;
	})(Dialog);
var NewsDialogUI=(function(_super){
		function NewsDialogUI(){
			
		    this.newsListBox=null;

			NewsDialogUI.__super.call(this);
		}

		CLASS$(NewsDialogUI,'ui.Dialogs.Lobby.NewsDialogUI',_super);
		var __proto__=NewsDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NewsDialogUI.uiView);
		}

		STATICATTR$(NewsDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1139,"height":640},"child":[{"type":"Image","props":{"y":66,"x":195,"skin":"assets/ui.news/bg_dialog.png"}},{"type":"Button","props":{"y":65,"x":878,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":87,"x":531,"skin":"assets/ui.news/img_news.png"}},{"type":"Box","props":{"y":139,"x":224,"width":686,"var":"newsListBox","height":382}}]};}
		]);
		return NewsDialogUI;
	})(Dialog);
var RecordOfPokerDialogUI=(function(_super){
		function RecordOfPokerDialogUI(){
			
		    this.roundLab=null;
		    this.pokerList=null;

			RecordOfPokerDialogUI.__super.call(this);
		}

		CLASS$(RecordOfPokerDialogUI,'ui.Dialogs.Lobby.RecordOfPokerDialogUI',_super);
		var __proto__=RecordOfPokerDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RecordOfPokerDialogUI.uiView);
		}

		STATICATTR$(RecordOfPokerDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":325,"x":575,"width":803,"skin":"assets/ui.roomEffort/bg_jiemian.png","height":578,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":122,"x":451,"skin":"assets/ui.recordOfPoker/img_jushudi.png"}},{"type":"Label","props":{"y":123,"x":461,"width":208,"var":"roundLab","text":"第1局","height":39,"fontSize":30,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":176,"x":852,"skin":"assets/ui.recordOfPoker/img_jifen.png"}},{"type":"Image","props":{"y":176,"x":515,"skin":"assets/ui.recordOfPoker/img_shoupai.png"}},{"type":"Image","props":{"y":176,"x":241,"skin":"assets/ui.recordOfPoker/img_touxiang.png"}},{"type":"Image","props":{"y":81,"x":579,"skin":"assets/ui.recordOfPoker/img_paixingjilu.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":39,"x":898,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Box","props":{"y":224,"x":217,"width":700,"var":"pokerList","height":344}},{"type":"Image","props":{"y":176,"x":757,"skin":"assets/ui.recordOfPoker/img_bet.png"}}]};}
		]);
		return RecordOfPokerDialogUI;
	})(Dialog);
var RoomEffortUI=(function(_super){
		function RoomEffortUI(){
			
		    this.effortBox=null;

			RoomEffortUI.__super.call(this);
		}

		CLASS$(RoomEffortUI,'ui.Dialogs.Lobby.RoomEffortUI',_super);
		var __proto__=RoomEffortUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RoomEffortUI.uiView);
		}

		STATICATTR$(RoomEffortUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":320,"x":586,"skin":"assets/ui.roomEffort/bg_jiemian.png","mouseEnabled":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":115,"x":178,"width":793,"var":"effortBox","height":454}},{"type":"Image","props":{"y":72,"x":605,"skin":"assets/ui.roomEffort/img_fangjianzhanji.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":30,"x":973,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}}]};}
		]);
		return RoomEffortUI;
	})(Dialog);
var SelectModeDialogUI=(function(_super){
		function SelectModeDialogUI(){
			
		    this.modeBtnBox=null;
		    this.classicalBtn=null;
		    this.staticBtn=null;
		    this.chaosBtn=null;
		    this.customizedBtn=null;
		    this.createRoomBtn=null;
		    this.roomSetBox=null;
		    this.conditionBox=null;
		    this.bigThenStraightCheck=null;
		    this.bigThenGodCheck=null;
		    this.roundNumSetBox=null;
		    this.tenRoundCheck=null;
		    this.twentyRoundCheck=null;
		    this.turnJokersBox=null;
		    this.noMoreJokerCheck=null;
		    this.oneMoreCheck=null;
		    this.twoMoreCheck=null;
		    this.jokerAnyCheck=null;
		    this.jokerFormationCheak=null;
		    this.nineGhostCheck=null;
		    this.betBox=null;
		    this.anyBetCheck=null;
		    this.moreBetCheck=null;
		    this.autoBetCheck=null;
		    this.multipeBox=null;
		    this.straightFlush=null;
		    this.threeOfAKind=null;
		    this.zeroSetBox=null;
		    this.winDoubleGhostCheck=null;
		    this.tripleWinDoubleGhostCheck=null;
		    this.tripleWinTripleGhostCheck=null;
		    this.doubleDealBox=null;
		    this.doubleCheck=null;
		    this.gambleBox=null;
		    this.fancyWinCheck=null;
		    this.customizedBox=null;
		    this.straightFlushCustomized=null;
		    this.straightCustomized=null;
		    this.threeOfAKindCustomized=null;
		    this.doubleJokerCustomized=null;
		    this.point0=null;
		    this.point1=null;
		    this.point2=null;
		    this.point3=null;
		    this.point4=null;
		    this.point5=null;
		    this.point6=null;
		    this.point7=null;
		    this.point8=null;
		    this.point9=null;
		    this.customizedTen=null;
		    this.customizedTwenty=null;
		    this.customizedThirty=null;
		    this.introductionBox=null;
		    this.titleIntroduction=null;
		    this.introductionPanel=null;
		    this.detailsIntroduction=null;

			SelectModeDialogUI.__super.call(this);
		}

		CLASS$(SelectModeDialogUI,'ui.Dialogs.Lobby.SelectModeDialogUI',_super);
		var __proto__=SelectModeDialogUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("Text",laya.display.Text);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SelectModeDialogUI.uiView);
		}

		STATICATTR$(SelectModeDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"y":0,"x":26,"width":1136,"vScrollBarSkin":"assets/ui.explan/vscroll.png","text":"同花顺","skin":"assets/ui.button/checkbox.png","mouseThrough":false,"mouseEnabled":true,"height":640,"color":"#7ffff5c"},"child":[{"type":"Image","props":{"y":23,"x":31,"skin":"assets/ui.select/bg_jiemian.png","mouseEnabled":true}},{"type":"Image","props":{"y":115,"x":461,"skin":"assets/ui.select/bg_01.png"}},{"type":"Image","props":{"y":115,"x":229,"skin":"assets/ui.select/bg_02.png"}},{"type":"Button","props":{"y":25,"x":1030,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Box","props":{"y":115,"x":82,"width":121,"var":"modeBtnBox","height":234},"child":[{"type":"Button","props":{"y":2,"x":-6,"var":"classicalBtn","stateNum":"1","skin":"assets/ui.button/img_jingdian.png"}},{"type":"Button","props":{"y":60,"x":-6,"var":"staticBtn","stateNum":"1","skin":"assets/ui.button/img_changzhuang.png"}},{"type":"Button","props":{"y":119,"x":-6,"var":"chaosBtn","stateNum":"1","skin":"assets/ui.button/img_hunzhan.png"}},{"type":"Button","props":{"y":180,"x":-6,"var":"customizedBtn","stateNum":"1","skin":"assets/ui.button/img_dingzhi.png"}}]},{"type":"Button","props":{"y":521,"x":687,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_yellow.png"},"child":[{"type":"Image","props":{"y":6,"x":36,"skin":"assets/ui.select/img_Determine.png"}}]},{"type":"Box","props":{"y":113,"x":465,"width":568,"var":"roomSetBox","height":420},"child":[{"type":"Box","props":{"y":62,"x":4,"width":560,"visible":true,"var":"conditionBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"text":"上庄条件：","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":115,"var":"bigThenStraightCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":1,"x":40,"text":"顺子以上","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"var":"bigThenGodCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-1,"x":41,"text":"天公以上","fontSize":"23","font":"Microsoft YaHei","color":"#f9f9f9"}}]}]},{"type":"Box","props":{"y":20,"x":4,"width":560,"var":"roundNumSetBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"text":"局数选择：","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":115,"var":"tenRoundCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":1,"x":38,"width":49.9755859375,"text":"10局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x3）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"var":"twentyRoundCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":3,"x":42,"text":"20局","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":10,"x":92,"text":"（钻石x6）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":103,"x":4,"width":560,"var":"turnJokersBox","height":80},"child":[{"type":"Text","props":{"y":0,"x":0,"text":"鬼       牌 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":115,"var":"noMoreJokerCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"不翻鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"var":"oneMoreCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":2,"x":45,"text":"翻鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":11,"x":439,"var":"twoMoreCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_S.png"},"child":[{"type":"Text","props":{"y":3,"x":25,"text":"翻2张","fontSize":"13","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":40,"x":115,"var":"jokerAnyCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"鬼牌百变","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":40,"x":290,"var":"jokerFormationCheak","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":0,"x":42,"text":"鬼牌成型","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":47,"x":439,"var":"nineGhostCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_S.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"带鬼天公双倍","fontSize":"13","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":190,"x":4,"width":560,"var":"betBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"text":"下注功能 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":115,"var":"anyBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"任意下注","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"var":"moreBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-3,"x":42,"wordWrap":true,"width":94,"text":"一杠到底","height":29,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"visible":false,"var":"autoBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":-3,"x":42,"wordWrap":true,"width":94,"text":"默认下注","height":29,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":232,"x":4,"width":560,"var":"multipeBox","height":39},"child":[{"type":"Text","props":{"y":0,"x":0,"text":"牌型倍数 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":0,"x":117,"text":"同花顺","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":1,"x":294,"text":"三    条","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":2,"x":256.00000000000006,"text":"倍","fontSize":"22","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":2,"x":436,"text":"倍","fontSize":"22","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Image","props":{"y":2,"x":200,"var":"straightFlush","skin":"assets/ui.select/img_beishukuang.png","name":"straightFlush"},"child":[{"type":"Label","props":{"y":0,"x":18,"text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c"}}]},{"type":"Image","props":{"y":3,"x":379,"var":"threeOfAKind","skin":"assets/ui.select/img_beishukuang.png","name":"threeOfAKind"},"child":[{"type":"Label","props":{"y":0,"x":18,"text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c"}}]}]},{"type":"Box","props":{"y":278,"x":4,"width":560,"var":"zeroSetBox","height":35},"child":[{"type":"CheckBox","props":{"y":2,"x":115,"var":"winDoubleGhostCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":0,"x":38,"text":"赢双鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"text":"木       虱 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":2,"x":230,"var":"tripleWinDoubleGhostCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":0,"x":38,"text":"三倍赢双鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":3,"x":390,"var":"tripleWinTripleGhostCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png"},"child":[{"type":"Text","props":{"y":0,"x":38,"text":"三倍赢三鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":363,"x":4,"width":560,"var":"doubleDealBox","height":35},"child":[{"type":"CheckBox","props":{"y":1,"x":115,"var":"doubleCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png"},"child":[{"type":"Text","props":{"y":-1,"x":39,"text":"加入功能牌","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"text":"功  能  牌 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Box","props":{"y":319,"x":4,"width":560,"var":"gambleBox","height":37},"child":[{"type":"CheckBox","props":{"y":2,"x":115,"var":"fancyWinCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png"},"child":[{"type":"Text","props":{"y":0,"x":38,"text":"有倍赢无倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"text":"比       牌 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":116,"x":462,"width":573,"visible":"false","var":"customizedBox","height":429},"child":[{"type":"Text","props":{"y":99,"x":15,"text":"牌型倍数 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":185,"x":15,"text":"点数倍数 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":97,"x":131,"text":"同花顺","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":98,"x":347,"text":"顺   子","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":135,"x":132,"text":"三   条","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":135,"x":347,"visible":false,"text":"双   鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":187,"x":352,"text":"2   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":229,"x":352,"text":"4   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":272,"x":352,"text":"6   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":315,"x":353,"text":"8   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":185,"x":135,"text":"1   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":227,"x":134,"text":"3   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":272,"x":134,"text":"5   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":316,"x":134,"text":"7   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":358,"x":134,"text":"9   点","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":21,"x":13,"visible":false,"text":"倍数选择 :","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":20,"x":229,"visible":false,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":98,"x":268,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":98.00000000000003,"x":481,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":135,"x":268.0000000000001,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":135,"x":481,"visible":false,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":185,"x":268.0000000000001,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":186,"x":481,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":226,"x":268.0000000000001,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":228,"x":481,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":271,"x":268,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":271,"x":481,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":316,"x":268,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":314,"x":481,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":357,"x":268,"text":"倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Image","props":{"y":99,"x":212,"var":"straightFlushCustomized","skin":"assets/ui.select/img_beishukuang.png","name":"straightFlushCustomized"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":50,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":99,"x":425,"var":"straightCustomized","skin":"assets/ui.select/img_beishukuang.png","name":"straightCustomized"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":50,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":137,"x":212,"var":"threeOfAKindCustomized","skin":"assets/ui.select/img_beishukuang.png","name":"threeOfAKindCustomized"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":50,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":136,"x":425,"visible":false,"var":"doubleJokerCustomized","skin":"assets/ui.select/img_beishukuang.png","name":"doubleJokerCustomized"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":50,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":111,"x":212,"visible":false,"var":"point0","skin":"assets/ui.select/img_beishukuang.png","name":"point0"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":186,"x":212,"var":"point1","skin":"assets/ui.select/img_beishukuang.png","name":"point1"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":189,"x":425,"var":"point2","skin":"assets/ui.select/img_beishukuang.png","name":"point2"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":229,"x":212,"var":"point3","skin":"assets/ui.select/img_beishukuang.png","name":"point3"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":230,"x":425,"var":"point4","skin":"assets/ui.select/img_beishukuang.png","name":"point4"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":273,"x":212,"var":"point5","skin":"assets/ui.select/img_beishukuang.png","name":"point5"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":273,"x":425,"var":"point6","skin":"assets/ui.select/img_beishukuang.png","name":"point6"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":317,"x":211,"var":"point7","skin":"assets/ui.select/img_beishukuang.png","name":"point7"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":316,"x":425,"var":"point8","skin":"assets/ui.select/img_beishukuang.png","name":"point8"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":359,"x":211,"var":"point9","skin":"assets/ui.select/img_beishukuang.png","name":"point9"},"child":[{"type":"Label","props":{"y":12,"x":24,"width":30,"valign":"middle","text":"9","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#ffb16c","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Box","props":{"y":21,"x":14,"width":560,"name":"roundSetBox","height":74},"child":[{"type":"Text","props":{"y":1,"x":3,"text":"局数选择：","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":121,"var":"customizedTen","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":1,"x":38,"width":49.9755859375,"text":"10局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x5）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":292,"var":"customizedTwenty","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":3,"x":42,"text":"20局","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":10,"x":92,"text":"（钻石x8）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":36,"x":121,"var":"customizedThirty","stateNum":"2","skin":"assets/ui.button/btn_Choice.png"},"child":[{"type":"Text","props":{"y":1,"x":38,"width":49.9755859375,"text":"30局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x10）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]}]}]},{"type":"Box","props":{"y":115,"x":229,"width":215,"var":"introductionBox","height":429},"child":[{"type":"Label","props":{"y":27,"x":108,"width":215,"var":"titleIntroduction","valign":"middle","text":"玩法简介","height":50,"fontSize":25,"font":"Microsoft YaHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":55,"x":7,"skin":"assets/ui.select/img_fengexian.png"}},{"type":"Panel","props":{"y":55,"x":3,"width":212,"var":"introductionPanel","vScrollBarSkin":"assets/comp/vscroll.png","height":374},"child":[{"type":"Label","props":{"y":3,"x":1,"wordWrap":true,"width":209,"var":"detailsIntroduction","text":"1.房主坐庄,不能更换庄家。2.每个玩家各派2张牌,下注后才能看牌。3.每个玩家有1次补牌机会,按发牌顺序轮流操作。4.最后庄家决定开牌,进入比牌环节。5.比牌环节,各个闲家跟庄家比牌大小。","padding":"10,5,10,5","leading":10,"height":0,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]}]}]};}
		]);
		return SelectModeDialogUI;
	})(Dialog);
var SettingDialogUI=(function(_super){
		function SettingDialogUI(){
			
		    this.greenTable=null;
		    this.green=null;
		    this.yellowTable=null;
		    this.yellow=null;
		    this.musicPos=null;
		    this.soundPos=null;
		    this.quitBtn=null;
		    this.mandarinBtn=null;
		    this.teochewBtn=null;
		    this.manBtn=null;
		    this.gildBtn=null;
		    this.madrainImg=null;
		    this.teochewImg=null;
		    this.manImg=null;
		    this.gildImg=null;

			SettingDialogUI.__super.call(this);
		}

		CLASS$(SettingDialogUI,'ui.Dialogs.Lobby.SettingDialogUI',_super);
		var __proto__=SettingDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SettingDialogUI.uiView);
		}

		STATICATTR$(SettingDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":20,"x":277,"width":562,"skin":"assets/ui.setting/bg_jiemian.png","mouseEnabled":true,"height":597}},{"type":"Image","props":{"y":105,"x":318,"width":478,"skin":"assets/ui.setting/bg_01.png","mouseEnabled":true,"height":415}},{"type":"Button","props":{"y":27,"x":778,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":371,"x":346,"skin":"assets/ui.setting/bg_02.png"}},{"type":"Image","props":{"y":249,"x":713,"skin":"assets/ui.setting/icon_Music.png"}},{"type":"Image","props":{"y":304,"x":712,"skin":"assets/ui.setting/icon_volume_l.png"}},{"type":"Image","props":{"y":390,"x":365,"var":"greenTable","skin":"assets/ui.setting/img_green02.png"}},{"type":"Image","props":{"y":400,"x":374,"var":"green","skin":"assets/ui.setting/img_green01.png"}},{"type":"Image","props":{"y":389,"x":560,"var":"yellowTable","skin":"assets/ui.setting/img_yelloe02.png"}},{"type":"Image","props":{"y":399,"x":570,"var":"yellow","skin":"assets/ui.setting/img_yelloe01.png"}},{"type":"Image","props":{"y":255,"x":426,"var":"musicPos","skin":"assets/ui.setting/bg_hslider.png"}},{"type":"Image","props":{"y":309,"x":426,"var":"soundPos","skin":"assets/ui.setting/bg_hslider.png"}},{"type":"Image","props":{"y":307,"x":346,"skin":"assets/ui.setting/img_yinxiao.png"}},{"type":"Image","props":{"y":252,"x":346,"skin":"assets/ui.setting/img_yinyue.png"}},{"type":"Image","props":{"y":50,"x":501,"skin":"assets/ui.setting/img_youxishezhi.png"}},{"type":"Image","props":{"y":134,"x":346,"skin":"assets/ui.setting/img_yuyan.png"}},{"type":"Image","props":{"y":120,"x":438,"skin":"assets/ui.setting/img_yuyanbg.png"}},{"type":"Image","props":{"y":354,"x":503,"skin":"assets/ui.setting/img_zhuobuxuanze.png"}},{"type":"Image","props":{"y":131,"x":635,"skin":"assets/ui.setting/img_chaoshanhua.png"}},{"type":"Image","props":{"y":131,"x":477,"skin":"assets/ui.setting/img_putonghua.png"}},{"type":"Button","props":{"y":125,"x":445,"visible":false,"stateNum":"1","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":5.000000000000028,"x":31,"skin":"assets/ui.setting/img_putonghua2.png"}}]},{"type":"Button","props":{"y":126,"x":599,"visible":false,"stateNum":"1","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":7,"x":34.000000000000114,"skin":"assets/ui.setting/img_chaoshanhua2.png"}}]},{"type":"Image","props":{"y":187,"x":438,"skin":"assets/ui.setting/img_yuyanbg.png"}},{"type":"Image","props":{"y":199,"x":645,"skin":"assets/ui.setting/img_nvsheng.png"}},{"type":"Image","props":{"y":201,"x":490,"skin":"assets/ui.setting/img_nansheng.png"}},{"type":"Button","props":{"y":192,"x":445,"visible":false,"stateNum":"1","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":9.000000000000028,"x":42,"skin":"assets/ui.setting/img_nansheng2.png"}}]},{"type":"Button","props":{"y":193,"x":599,"visible":false,"stateNum":"1","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":7,"x":46.000000000000114,"skin":"assets/ui.setting/img_nvsheng2.png"}}]},{"type":"Button","props":{"y":527,"x":487,"var":"quitBtn","stateNum":"2","skin":"assets/ui.button/btn_bule.png"},"child":[{"type":"Image","props":{"y":10,"x":20,"skin":"assets/ui.setting/img_tuichu.png"}}]},{"type":"Image","props":{"y":198,"x":346,"skin":"assets/ui.setting/img_shengyin.png"}},{"type":"Button","props":{"y":125,"x":444,"width":138,"visible":true,"var":"mandarinBtn","stateNum":"1","height":40}},{"type":"Button","props":{"y":125,"x":598,"width":138,"visible":true,"var":"teochewBtn","stateNum":"1","height":40}},{"type":"Button","props":{"y":192,"x":444,"width":138,"visible":true,"var":"manBtn","stateNum":"1","height":40}},{"type":"Button","props":{"y":192,"x":598,"width":138,"visible":true,"var":"gildBtn","stateNum":"1","height":40}},{"type":"Image","props":{"y":125,"x":445,"visible":true,"var":"madrainImg","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":7,"x":34.000000000000114,"skin":"assets/ui.setting/img_putonghua2.png"}}]},{"type":"Image","props":{"y":125,"x":599,"visible":true,"var":"teochewImg","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":7,"x":34.000000000000114,"skin":"assets/ui.setting/img_chaoshanhua2.png"}}]},{"type":"Image","props":{"y":192,"x":445,"visible":true,"var":"manImg","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":9,"x":42,"skin":"assets/ui.setting/img_nansheng2.png"}}]},{"type":"Image","props":{"y":193,"x":599,"visible":true,"var":"gildImg","skin":"assets/ui.setting/btn_01.png"},"child":[{"type":"Image","props":{"y":7,"x":46.000000000000114,"skin":"assets/ui.setting/img_nvsheng2.png"}}]}]};}
		]);
		return SettingDialogUI;
	})(Dialog);
var ShareDialogUI=(function(_super){
		function ShareDialogUI(){
			
		    this.shareWithFriend=null;
		    this.shareWithAllFriend=null;

			ShareDialogUI.__super.call(this);
		}

		CLASS$(ShareDialogUI,'ui.Dialogs.Lobby.ShareDialogUI',_super);
		var __proto__=ShareDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ShareDialogUI.uiView);
		}

		STATICATTR$(ShareDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":297,"x":572,"skin":"assets/ui.share/bg_jiemian.png","mouseEnabled":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":303,"x":574,"skin":"assets/ui.share/bg_02.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":237,"x":379,"var":"shareWithFriend","skin":"assets/ui.share/icon_wx.png"}},{"type":"Image","props":{"y":237,"x":641,"var":"shareWithAllFriend","skin":"assets/ui.share/icon_pyq.png"}},{"type":"Image","props":{"y":370,"x":385,"skin":"assets/ui.share/img_haoyoufenxiang.png"}},{"type":"Image","props":{"y":370,"x":650,"skin":"assets/ui.share/img_pyqfenxiang.png"}},{"type":"Button","props":{"y":110,"x":854,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":138,"x":529,"skin":"assets/ui.share/img_share.png"}}]};}
		]);
		return ShareDialogUI;
	})(Dialog);
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){
			
		    this.sureBtn=null;
		    this.massageLab=null;
		    this.cancelBtn=null;

			MessageDialogUI.__super.call(this);
		}

		CLASS$(MessageDialogUI,'ui.Dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":320,"x":568,"skin":"assets/ui.tip/bg_jiemian.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":320,"x":568,"skin":"assets/ui.tip/bg_01.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":210,"x":568,"skin":"assets/ui.tip/img_Prompt.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":432,"x":458,"var":"sureBtn","stateNum":"2","skin":"assets/ui.button/btn_yellow.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":37,"skin":"assets/ui.inputRoom/img_queding.png"}}]},{"type":"Label","props":{"y":320,"x":568,"wordWrap":true,"width":455,"var":"massageLab","valign":"middle","text":"好多蚊子好多蚊子","padding":"0,5,5,5","leading":6,"height":140,"fontSize":28,"color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"y":431,"x":679,"var":"cancelBtn","stateNum":"2","skin":"assets/ui.button/btn_bule.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":37,"skin":"assets/ui.room/img_cancel.png"}}]}]};}
		]);
		return MessageDialogUI;
	})(Dialog);
var PlayerInfoDailogUI=(function(_super){
		function PlayerInfoDailogUI(){
			
		    this.imgBg=null;
		    this.avatarImage=null;
		    this.nameLab=null;
		    this.idNumLab=null;
		    this.godNumLab=null;
		    this.sharmNumLab=null;
		    this.winLab=null;
		    this.roundNumLab=null;
		    this.genderImg=null;
		    this.selfInfoBox=null;
		    this.tokenLab=null;
		    this.btnIncrease=null;
		    this.otherInfoBox=null;
		    this.kickBtn=null;
		    this.standBtn=null;
		    this.banned=null;
		    this.stateTitle=null;
		    this.btnClose=null;

			PlayerInfoDailogUI.__super.call(this);
		}

		CLASS$(PlayerInfoDailogUI,'ui.Dialogs.PlayerInfoDailogUI',_super);
		var __proto__=PlayerInfoDailogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(PlayerInfoDailogUI.uiView);
		}

		STATICATTR$(PlayerInfoDailogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Box","props":{"y":131,"x":188,"width":782,"height":328},"child":[{"type":"Image","props":{"y":-28.00000000000003,"x":-21.00000000000003,"var":"imgBg","skin":"assets/ui.playerInfo/bg_jiemian2.png"}},{"type":"Image","props":{"y":-34,"x":34,"width":163,"var":"avatarImage","skin":"assets/ui.room/img_head_icon.png","height":163},"child":[{"type":"Image","props":{"y":-3,"x":-2,"width":166,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":166}}]},{"type":"Image","props":{"y":-37.999999999999986,"x":29.999999999999943,"skin":"assets/ui.room/img_head.png"}},{"type":"Image","props":{"y":196,"x":74,"skin":"assets/ui.playerInfo/img_xinxikuang.png"}},{"type":"Image","props":{"y":196,"x":243,"skin":"assets/ui.playerInfo/img_xinxikuang.png"}},{"type":"Image","props":{"y":196,"x":424,"skin":"assets/ui.playerInfo/img_xinxikuang.png"}},{"type":"Image","props":{"y":196,"x":605,"skin":"assets/ui.playerInfo/img_xinxikuang.png"}},{"type":"Label","props":{"y":50.99999999999994,"x":249.99999999999972,"var":"nameLab","text":"玩家名字七个字","fontSize":24,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":62.99999999999997,"x":556.9999999999997,"text":"ID :","fontSize":23,"font":"Microsoft YaHei","color":"#c39bf5"}},{"type":"Label","props":{"y":62.99999999999997,"x":604,"var":"idNumLab","text":"123456789","fontSize":23,"font":"Microsoft YaHei","color":"#c39bf5"}},{"type":"Label","props":{"y":258,"x":606.9999999999998,"width":105,"var":"godNumLab","text":"8888","height":24,"fontSize":24,"font":"Microsoft YaHei","color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":258,"x":246.99,"width":105,"var":"sharmNumLab","text":"8888","height":24,"fontSize":24,"font":"Microsoft YaHei","color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":258,"x":425.99,"width":105,"var":"winLab","text":"100%","height":24,"fontSize":24,"font":"Microsoft YaHei","color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":258,"x":76.99999999999994,"width":105,"var":"roundNumLab","text":"8888","height":24,"fontSize":24,"font":"Microsoft YaHei","color":"#ffb16c","align":"center"}},{"type":"Image","props":{"y":248,"x":602,"skin":"assets/ui.playerInfo/img_fengexian1.png"}},{"type":"Image","props":{"y":246,"x":424,"skin":"assets/ui.playerInfo/img_fengexian1.png"}},{"type":"Image","props":{"y":247.00000000000006,"x":246,"skin":"assets/ui.playerInfo/img_fengexian1.png"}},{"type":"Image","props":{"y":247.00000000000006,"x":73.99999999999989,"skin":"assets/ui.playerInfo/img_fengexian1.png"}},{"type":"Image","props":{"y":49.999999999999915,"x":213.9999999999999,"var":"genderImg","skin":"assets/ui.playerInfo/icon_woman.png"}},{"type":"Image","props":{"y":213,"x":441,"skin":"assets/ui.playerInfo/img_winning.png"}},{"type":"Image","props":{"y":213,"x":262,"skin":"assets/ui.playerInfo/img_charm.png"}},{"type":"Image","props":{"y":213,"x":621,"skin":"assets/ui.playerInfo/img_tiangongshu.png"}},{"type":"Image","props":{"y":213,"x":103,"skin":"assets/ui.playerInfo/img_paiju.png"}},{"type":"Image","props":{"y":169,"x":5,"skin":"assets/ui.playerInfo/img_fengexian2.png"}},{"type":"Box","props":{"y":-28.00000000000003,"x":-21.00000000000003,"width":814,"var":"selfInfoBox","height":367},"child":[{"type":"Image","props":{"y":135.99999999999997,"x":238.99999999999997,"skin":"assets/ui.playerInfo/img_fangkadi.png"}},{"type":"Label","props":{"y":137.99999999999997,"x":285,"var":"tokenLab","text":"200000","fontSize":23,"font":"Microsoft YaHei","color":"#ffc35a"}},{"type":"Button","props":{"y":137.00000000000003,"x":383,"var":"btnIncrease","stateNum":"2","skin":"assets/ui.button/gtn_increase.png"}},{"type":"Image","props":{"y":141,"x":242,"skin":"assets/ui.main/icon_roomcard.png"}},{"type":"Label","props":{"y":137.99999999999997,"x":535.0000000000001,"text":"邀请码 :","fontSize":23,"font":"Microsoft YaHei","color":"#c39bf5"}},{"type":"Label","props":{"y":139.99999999999997,"x":626,"text":"123456789","name":"inviteLab","fontSize":23,"font":"Microsoft YaHei","color":"#c39bf5"}},{"type":"Image","props":{"y":127.00000000000003,"x":73.00000000000003,"skin":"assets/ui.playerInfo/img_edit.png"}}]},{"type":"Box","props":{"y":-28.00000000000003,"x":-21.00000000000003,"width":814,"var":"otherInfoBox","height":445},"child":[{"type":"Button","props":{"y":352.0000000000001,"x":117.00000000000003,"var":"kickBtn","stateNum":"2","skin":"assets/ui.button/btn_bule.png"},"child":[{"type":"Image","props":{"y":8,"x":42,"skin":"assets/ui.playerInfo/img_tiren.png"}}]},{"type":"Button","props":{"y":352.0000000000001,"x":335.9999999999999,"var":"standBtn","stateNum":"2","skin":"assets/ui.button/btn_bule.png"},"child":[{"type":"Image","props":{"y":10,"x":23,"skin":"assets/ui.playerInfo/img_qiangzhizhanqi.png"}}]},{"type":"Button","props":{"y":352.0000000000001,"x":548.9999999999999,"var":"banned","stateNum":"2","skin":"assets/ui.button/btn_bule.png"},"child":[{"type":"Image","props":{"y":25,"x":79,"var":"stateTitle","skin":"assets/ui.playerInfo/img_gag.png","anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Button","props":{"y":-19.000000000000014,"x":735,"var":"btnClose","stateNum":"2","skin":"assets/ui.button/btn_Close.png"}}]}]};}
		]);
		return PlayerInfoDailogUI;
	})(Dialog);
var BuyItemDialogUI=(function(_super){
		function BuyItemDialogUI(){
			
		    this.buyBtn=null;
		    this.itemLight=null;
		    this.productDesc=null;
		    this.productPrice=null;
		    this.gameInfoLabBox=null;
		    this.wechatLab=null;

			BuyItemDialogUI.__super.call(this);
		}

		CLASS$(BuyItemDialogUI,'ui.Dialogs.Room.BuyItemDialogUI',_super);
		var __proto__=BuyItemDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BuyItemDialogUI.uiView);
		}

		STATICATTR$(BuyItemDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":310,"x":560,"skin":"assets/ui.buyItem/bg_jiemian.png","mouseEnabled":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":58,"x":957,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":83,"x":520,"skin":"assets/ui.buyItem/img_Shop.png"}},{"type":"Button","props":{"y":453,"x":491,"var":"buyBtn","stateNum":"2","skin":"assets/ui.button/btn_yellow.png"},"child":[{"type":"Image","props":{"y":10,"x":21,"skin":"assets/ui.buyItem/img_buy.png"}}]},{"type":"Image","props":{"y":266,"x":274,"skin":"assets/ui.buyItem/bg_01.png","name":"item_10001","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":26,"x":66,"skin":"assets/ui.buyItem/icon_bg.png"}},{"type":"Image","props":{"y":59,"x":99,"skin":"assets/ui.buyItem/icon_Diamonds_S.png"}},{"type":"Image","props":{"y":2,"x":2,"skin":"assets/ui.buyItem/img_TitleBG.png"}},{"type":"Label","props":{"y":6,"x":26,"width":230,"valign":"middle","text":"钻石3颗","name":"diamondText","height":26,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":147,"x":59,"skin":"assets/ui.buyItem/img_01.png"}},{"type":"Label","props":{"y":150,"x":74,"width":130,"valign":"middle","text":"6元","name":"priceText","height":22,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":266,"x":559,"skin":"assets/ui.buyItem/bg_01.png","name":"item_10002","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":25,"x":65,"skin":"assets/ui.buyItem/icon_bg.png"}},{"type":"Image","props":{"y":55,"x":90,"skin":"assets/ui.buyItem/icon_Diamonds_M.png"}},{"type":"Image","props":{"y":2,"x":2,"skin":"assets/ui.buyItem/img_TitleBG.png"}},{"type":"Label","props":{"y":6,"x":26,"width":230,"valign":"middle","text":"钻石3颗","name":"diamondText","height":26,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":147,"x":55,"skin":"assets/ui.buyItem/img_01.png"}},{"type":"Label","props":{"y":150,"x":74,"width":130,"valign":"middle","text":"6元","name":"priceText","height":22,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":266,"x":843,"skin":"assets/ui.buyItem/bg_01.png","name":"item_10003","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":32,"x":73,"skin":"assets/ui.buyItem/icon_bg.png"}},{"type":"Image","props":{"y":51,"x":93,"skin":"assets/ui.buyItem/icon_Diamonds_L.png"}},{"type":"Image","props":{"y":2,"x":2,"skin":"assets/ui.buyItem/img_TitleBG.png"}},{"type":"Label","props":{"y":6,"x":26,"width":230,"valign":"middle","text":"钻石3颗","name":"diamondText","height":26,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":148,"x":60,"skin":"assets/ui.buyItem/img_01.png"}},{"type":"Label","props":{"y":150,"x":74,"width":130,"valign":"middle","text":"6元","name":"priceText","height":22,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":265,"x":275,"var":"itemLight","skin":"assets/ui.buyItem/bg_01Selected.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":373,"x":141,"width":342,"var":"productDesc","valign":"middle","text":"购买获得一科钻石","height":24,"fontSize":24,"font":"Microsoft YaHei","color":"#ffbc6e","align":"left"}},{"type":"Label","props":{"y":403,"x":141,"width":147,"valign":"middle","text":"应付金额：","height":24,"fontSize":30,"font":"Microsoft YaHei","color":"#ffbc6e","align":"left"}},{"type":"Label","props":{"y":403,"x":291,"width":162,"var":"productPrice","valign":"middle","text":"6元","height":24,"fontSize":30,"font":"Microsoft YaHei","color":"#ffbc6e","align":"left"}},{"type":"Box","props":{"y":137,"x":362,"width":382,"var":"gameInfoLabBox","height":29},"child":[{"type":"Label","props":{"y":-1,"x":2,"width":85,"text":"游戏咨询:","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":0,"x":150,"width":195,"var":"wechatLab","text":"qwerdf","height":27,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":-1,"x":92,"width":85,"text":"[微信]","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]}]};}
		]);
		return BuyItemDialogUI;
	})(Dialog);
var ChatViewDialogUI=(function(_super){
		function ChatViewDialogUI(){
			
		    this.chatBox=null;
		    this.normalBtn=null;
		    this.expressionBtn=null;
		    this.chatClickBtn=null;
		    this.chatInpuBox=null;
		    this.chatInputLab=null;
		    this.sandBtn=null;
		    this.chatList=null;
		    this.normalInputBox=null;
		    this.statementsList=null;
		    this.expressionBox=null;
		    this.expressionList=null;

			ChatViewDialogUI.__super.call(this);
		}

		CLASS$(ChatViewDialogUI,'ui.Dialogs.Room.ChatViewDialogUI',_super);
		var __proto__=ChatViewDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ChatViewDialogUI.uiView);
		}

		STATICATTR$(ChatViewDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Box","props":{"y":48,"x":6,"width":430,"visible":true,"var":"chatBox","height":525},"child":[{"type":"Image","props":{"skin":"assets/ui.room/chat/bg.png"}},{"type":"Button","props":{"y":6,"x":7,"var":"normalBtn","stateNum":"2","skin":"assets/ui.room/chat/btn_0002.png"},"child":[{"type":"Image","props":{"y":20,"x":6,"skin":"assets/ui.room/chat/img_Common.png"}}]},{"type":"Button","props":{"y":179,"x":7,"var":"expressionBtn","stateNum":"2","skin":"assets/ui.room/chat/btn_0003.png"},"child":[{"type":"Image","props":{"y":23,"x":5,"skin":"assets/ui.room/chat/img_expressio.png"}}]},{"type":"Button","props":{"y":350,"x":7,"var":"chatClickBtn","stateNum":"2","skin":"assets/ui.room/chat/btn_0004.png"},"child":[{"type":"Image","props":{"y":25,"x":4,"skin":"assets/ui.room/chat/img_chat.png"}}]},{"type":"Box","props":{"y":10,"x":73,"width":350,"visible":false,"var":"chatInpuBox","height":430},"child":[{"type":"Image","props":{"y":442,"x":6,"skin":"assets/ui.room/chat/OutputFrame.png"},"child":[{"type":"TextInput","props":{"y":0,"x":0,"width":168,"var":"chatInputLab","type":"text","prompt":"输入聊天内容","overflow":"hidden","maxChars":200,"height":41,"fontSize":16,"font":"Microsoft YaHei","color":"#000000","align":"left"}}]},{"type":"Button","props":{"y":442,"x":263,"var":"sandBtn","stateNum":"2","skin":"assets/ui.room/chat/btn_0001.png"},"child":[{"type":"Image","props":{"y":9,"x":4,"skin":"assets/ui.room/chat/SendOut.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":350,"var":"chatList","height":430}},{"type":"Image","props":{"y":433,"x":-3,"skin":"assets/ui.room/chat/img_Divide.png"}}]},{"type":"Box","props":{"y":10,"x":73,"width":350,"var":"normalInputBox","height":430},"child":[{"type":"List","props":{"width":350,"var":"statementsList","height":505}}]},{"type":"Box","props":{"y":10,"x":73,"width":350,"visible":false,"var":"expressionBox","height":430},"child":[{"type":"List","props":{"width":350,"var":"expressionList","height":505}}]}]}]};}
		]);
		return ChatViewDialogUI;
	})(Dialog);
var DisbandDialogUI=(function(_super){
		function DisbandDialogUI(){
			
		    this.closeBtn=null;
		    this.yesBtn=null;
		    this.timeLab=null;
		    this.titleLab=null;
		    this.playerBox=null;
		    this.waitLab=null;

			DisbandDialogUI.__super.call(this);
		}

		CLASS$(DisbandDialogUI,'ui.Dialogs.Room.DisbandDialogUI',_super);
		var __proto__=DisbandDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(DisbandDialogUI.uiView);
		}

		STATICATTR$(DisbandDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":96,"x":248,"skin":"assets/ui.room/disband/img_jiemian.png"}},{"type":"Image","props":{"y":165,"x":287,"skin":"assets/ui.room/disband/img_01.png"}},{"type":"Image","props":{"y":114.99999999999999,"x":486.00000000000006,"skin":"assets/ui.room/disband/img_jieshan.png"}},{"type":"Button","props":{"y":454,"x":637,"var":"closeBtn","stateNum":"2","skin":"assets/ui.button/btn_yellow.png","labelSize":25,"labelFont":"Microsoft YaHei","labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":5,"x":37,"skin":"assets/ui.room/disband/img_jujue.png"}}]},{"type":"Button","props":{"y":454,"x":387,"var":"yesBtn","stateNum":"2","skin":"assets/ui.button/btn_green.png","labelSize":25,"labelFont":"Microsoft YaHei","labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":4,"x":37,"skin":"assets/ui.room/disband/img_tongyi.png"}}]},{"type":"Label","props":{"y":420,"x":375,"text":"超过两分钟未作出选择，默认同意","fontSize":20,"font":"Microsoft YaHei","color":"#d72321"}},{"type":"Label","props":{"y":418,"x":700,"width":129,"var":"timeLab","text":"02：20","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#ff2925"}},{"type":"Label","props":{"y":176,"x":309,"wordWrap":true,"width":567,"var":"titleLab","leading":8,"height":65,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":243,"x":320,"width":528,"var":"playerBox","height":146},"child":[{"type":"Label","props":{"y":0,"x":0,"width":127,"text":"玩家","name":"playerName_0","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":-1.0000000000000284,"x":134.00000000000006,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":-4,"x":284,"width":142,"text":"玩家","name":"playerName_1","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":2,"x":155,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":29,"x":0,"width":127,"text":"玩家","name":"playerName_2","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":-1.0000000000000284,"x":134.00000000000006,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":27,"x":284,"width":142,"text":"玩家","name":"playerName_3","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":2,"x":155,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":60,"x":0,"width":127,"text":"玩家","name":"playerName_4","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":-1.0000000000000284,"x":134.00000000000006,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":57,"x":284,"width":142,"text":"玩家","name":"playerName_5","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":2,"x":155,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":90,"x":0,"width":127,"text":"玩家","name":"playerName_6","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":-1.0000000000000284,"x":134.00000000000006,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":89,"x":284,"width":142,"text":"玩家","name":"playerName_7","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":2,"x":155,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":117,"x":0,"width":127,"text":"玩家","name":"playerName_8","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":-1.0000000000000284,"x":134.00000000000006,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":115,"x":284,"width":142,"text":"玩家","name":"playerName_9","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"},"child":[{"type":"Label","props":{"y":2,"x":155,"width":85,"text":"等待选择","name":"playerSelect","height":26,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Label","props":{"y":465,"x":485,"var":"waitLab","text":"等待其他玩家操作","fontSize":25,"font":"Microsoft YaHei","color":"#ffffff"}}]};}
		]);
		return DisbandDialogUI;
	})(Dialog);
var EffortOfRoomDialogUI=(function(_super){
		function EffortOfRoomDialogUI(){
			
		    this.effortBox=null;

			EffortOfRoomDialogUI.__super.call(this);
		}

		CLASS$(EffortOfRoomDialogUI,'ui.Dialogs.Room.EffortOfRoomDialogUI',_super);
		var __proto__=EffortOfRoomDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(EffortOfRoomDialogUI.uiView);
		}

		STATICATTR$(EffortOfRoomDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":23,"x":187,"skin":"assets/ui.effortOfRoomRound/bg_jiemian.png","mouseEnabled":true}},{"type":"Button","props":{"y":25,"x":917,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Image","props":{"y":47,"x":500,"skin":"assets/ui.effortOfRoomRound/img_shangyijuzhanji.png"}},{"type":"Box","props":{"y":95,"x":222,"width":739,"var":"effortBox","height":494}}]};}
		]);
		return EffortOfRoomDialogUI;
	})(Dialog);
var ExplanDialogUI=(function(_super){
		function ExplanDialogUI(){
			
		    this.explanBox=null;
		    this.viewList=null;
		    this.page1=null;
		    this.page2=null;
		    this.page3=null;
		    this.page4=null;

			ExplanDialogUI.__super.call(this);
		}

		CLASS$(ExplanDialogUI,'ui.Dialogs.Room.ExplanDialogUI',_super);
		var __proto__=ExplanDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ExplanDialogUI.uiView);
		}

		STATICATTR$(ExplanDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"text":"1. 特殊牌型：三鬼>双鬼>天公9>天公8>三条,同花顺>顺子，三鬼30倍，双鬼10倍，顺子4倍，其中三条，同花顺可自定义倍数，倍数大者为大，同一牌型中的牌不比较大小。 顺子定义：A-K为闭环关系，任何顺序连在一起的牌都算为顺子，例如9、10、J为顺子，K、A、2亦为顺子，如果花色相同，即为同花顺。","mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":320,"x":568,"skin":"assets/ui.explan/bg_jiemian.png","mouseEnabled":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":75,"x":568,"skin":"assets/ui.explan/img_wanfashuoming.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":108.00000000000001,"x":200.99999999999994,"skin":"assets/ui.explan/bg_01.png"}},{"type":"Button","props":{"y":32,"x":919,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Box","props":{"y":114,"x":207,"width":730,"var":"explanBox","height":455},"child":[{"type":"List","props":{"y":0,"x":0,"width":730,"var":"viewList","repeatY":4,"repeatX":1,"height":445}},{"type":"Box","props":{"y":0,"x":-2.842170943040401e-14,"width":730,"var":"page1","height":445},"child":[{"type":"Label","props":{"y":7,"x":17,"text":"一、游戏介绍","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":41.99999999999997,"x":17.000000000000057,"wordWrap":true,"width":710,"text":"木虱是广东潮汕地区盛行的一种纸牌竞技游戏，以其独特的比牌规则，玩法多样，节奏轻快，挑战玩家的胆识，深受广大玩家欢迎","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":109.00000000000003,"x":17.000000000000057,"text":"二、基本规则","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":148,"x":17,"text":"1.游戏人数：2-8人","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":178,"x":17,"wordWrap":true,"width":710,"text":"2.游戏牌数：一副扑克牌，包括大小王和广告牌，其中广告牌定义为功能牌，功能牌可选择是否加入，共54-55张牌","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":246.00000000000006,"x":17.000000000000057,"text":"三、玩法介绍","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":285.00000000000006,"x":17,"wordWrap":true,"width":710,"text":"1.游戏模式：经典模式，长庄模式，混战模式，定制模式","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":317.0000000000001,"x":31.99999999999997,"wordWrap":true,"width":710,"text":"经典模式：经典抢庄，可选择天公上庄或者顺子以上上庄","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":348.0000000000001,"x":32,"wordWrap":true,"width":710,"text":"长庄模式：房主霸王庄，不可换庄","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":378.00000000000006,"x":32,"wordWrap":true,"width":710,"text":"混战模式：俗称木虱鱼，无庄家，各玩家之间相互比牌","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":408,"x":32,"wordWrap":true,"width":710,"text":"定制模式：私人定制，牌型倍数自定义，玩法更刺激","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":436,"x":17,"text":"2.发牌：每位玩家首轮牌为两张牌","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Box","props":{"y":0,"x":-2.842170943040401e-14,"width":720,"var":"page2","height":445},"child":[{"type":"Label","props":{"y":9,"x":17,"width":720,"text":"3.补牌：玩家根据首轮牌情况，选择是否补牌，每位玩家有且仅有一次补牌机会","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":38,"x":17,"width":720,"text":"4.比牌：玩家根据手中持有牌进行牌型大小比较","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":73,"x":17,"width":720,"text":"四、牌型说明","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Image","props":{"y":109,"x":-16,"skin":"assets/ui.explan/img_paixing.png"}}]},{"type":"Box","props":{"y":0,"x":-2.842170943040401e-14,"width":730,"var":"page3","height":445},"child":[{"type":"Label","props":{"y":7,"x":17,"text":"五、牌型比较","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":45,"x":17,"wordWrap":true,"width":658,"text":"1.特殊牌型：三鬼>双鬼>天公9>天公8>三条,同花顺>顺子，三鬼30倍，双鬼10倍，顺子4倍，其中三条，同花顺可自定义倍数，倍数大者为大，同一牌型中的牌不比较大小。 顺子定义：A-K为闭环关系，任何顺序连在一起的牌都算为顺子，例如9、10、J为顺子，K、A、2亦为顺子，如果花色相同，即为同花顺。","leading":10,"height":111,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":164,"x":17,"wordWrap":true,"width":710,"text":"2.普通牌型：点数牌>木虱（0点）","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":196,"x":31,"wordWrap":true,"width":664,"text":"点数说明：A-9分别为1-9点，10，J，Q，K均按10点算。三张或两张牌点数相加，个位数点数大者为大，若两张花色相同或者对子，则为2倍，三张牌花色相同为3倍","leading":10,"height":56,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":258,"x":17,"wordWrap":true,"width":710,"text":"3.特殊牌型>普通牌型","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":293,"x":17,"wordWrap":true,"width":710,"text":"4.木虱为最小点数牌型，但可以赢双鬼","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":329,"x":17,"wordWrap":true,"width":710,"text":"六、大小王（鬼牌）","leading":10,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":365,"x":17,"wordWrap":true,"width":710,"text":"游戏可设置鬼牌不同功能","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":396,"x":17,"wordWrap":true,"width":710,"text":"1.鬼牌跟牌型，能拼出特殊牌型，如鬼牌、7、8为顺子或同花顺，鬼牌、7、7为三条，其他情况鬼牌算10点，如鬼牌、5、8为3点。鬼、8（9）算天公","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Box","props":{"y":0,"x":-2.842170943040401e-14,"width":720,"var":"page4","height":445},"child":[{"type":"Label","props":{"y":7,"x":17,"wordWrap":true,"width":710,"text":"2.鬼牌可当任意一张牌及花色，即是拿到鬼牌若不能拼出特殊牌型，也最少是9点。首轮牌鬼、8（9）不能算天公，必须补牌","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":79,"x":17,"wordWrap":true,"width":710,"text":"七、特殊可选规则","leading":10,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":116,"x":17,"wordWrap":true,"width":710,"text":"1.鬼牌：默认为不翻鬼，即只有2张鬼牌(大小王)；翻鬼，可选择翻1或2张牌当鬼牌，即牌中最多有8张鬼牌。若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":178,"x":17,"wordWrap":true,"width":710,"text":"2.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":213,"x":17,"wordWrap":true,"width":710,"text":"3.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":274,"x":17,"wordWrap":true,"width":710,"text":"4.任意下注：每一局可任意选择下注倍数","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":304,"x":17,"wordWrap":true,"width":710,"text":"5.一杠到底：在同一个庄上，开弓没有回头箭，下注倍数只能加不能减。换庄后，可重新选择下注倍数","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":363,"x":17,"wordWrap":true,"width":710,"text":"6.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能。","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":425,"x":17,"wordWrap":true,"width":710,"text":"7.木虱：设置木虱赢双鬼、三鬼的条件","leading":10,"fontSize":18,"font":"Microsoft YaHei","color":"#ffffff"}}]}]}]};}
		]);
		return ExplanDialogUI;
	})(Dialog);
var FinalDialogUI=(function(_super){
		function FinalDialogUI(){
			
		    this.lobbyBtn=null;
		    this.effortBtn=null;
		    this.shareBtn=null;
		    this.finalBox=null;

			FinalDialogUI.__super.call(this);
		}

		CLASS$(FinalDialogUI,'ui.Dialogs.Room.FinalDialogUI',_super);
		var __proto__=FinalDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(FinalDialogUI.uiView);
		}

		STATICATTR$(FinalDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":9,"x":137,"skin":"assets/ui.room/final/bg_jiemian.png"}},{"type":"Image","props":{"y":20,"x":435,"skin":"assets/ui.room/final/img_bg1.png"}},{"type":"Image","props":{"y":28,"x":518,"skin":"assets/ui.room/final/img_fangjianjiesuan.png"}},{"type":"Button","props":{"y":566,"x":495,"var":"lobbyBtn","stateNum":"2","skin":"assets/ui.button/btn_bule.png"},"child":[{"type":"Image","props":{"y":10,"x":20,"skin":"assets/ui.room/final/img_fanhuidating.png"}}]},{"type":"Button","props":{"y":566,"x":276,"var":"effortBtn","stateNum":"2","skin":"assets/ui.button/btn_yellow.png"},"child":[{"type":"Image","props":{"y":8,"x":20,"skin":"assets/ui.room/final/img_zhanjixiangqing.png"}}]},{"type":"Button","props":{"y":565,"x":713,"var":"shareBtn","stateNum":"2","skin":"assets/ui.button/btn_green.png"},"child":[{"type":"Image","props":{"y":10,"x":39,"skin":"assets/ui.room/final/img_share.png"}}]},{"type":"Box","props":{"y":82,"x":177,"width":828,"var":"finalBox","height":480}}]};}
		]);
		return FinalDialogUI;
	})(Dialog);
var RubbedPokerDialogUI=(function(_super){
		function RubbedPokerDialogUI(){
			
		    this.verticalPanel=null;
		    this.horizontalPanel=null;
		    this.changeDirectionBtn=null;

			RubbedPokerDialogUI.__super.call(this);
		}

		CLASS$(RubbedPokerDialogUI,'ui.Dialogs.Room.RubbedPokerDialogUI',_super);
		var __proto__=RubbedPokerDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RubbedPokerDialogUI.uiView);
		}

		STATICATTR$(RubbedPokerDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Panel","props":{"y":60,"x":568,"width":346,"visible":false,"var":"verticalPanel","rotation":0,"height":483,"anchorY":0,"anchorX":0.5},"child":[{"type":"Image","props":{"skin":"assets/pokers/rubbedPoker/poker_back.png","name":"pokerBack"}},{"type":"Image","props":{"y":483,"x":173,"skin":"assets/pokers/rubbedPoker/club_1.png","name":"rubbedPoker","anchorX":0.5}},{"type":"Image","props":{"width":346,"visible":false,"skin":"assets/ui.room/zhezhao.png","name":"maskPoker","height":484}},{"type":"Image","props":{"y":414,"x":3,"skin":"assets/pokers/rubbedPoker/img_02.png","name":"guideImg"}}]},{"type":"Panel","props":{"y":150,"x":568,"width":584,"visible":false,"var":"horizontalPanel","rotation":0,"height":346,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":534,"skin":"assets/pokers/rubbedPoker/poker_back.png","rotation":90,"name":"pokerBack"}},{"type":"Image","props":{"y":346,"x":534,"skin":"assets/pokers/rubbedPoker/club_1.png","rotation":90,"name":"rubbedPoker"}},{"type":"Image","props":{"y":0,"x":52,"width":483,"visible":false,"skin":"assets/ui.room/zhezhao.png","name":"maskPoker","height":347}},{"type":"Image","props":{"y":277,"x":53,"width":479,"skin":"assets/pokers/rubbedPoker/img_01.png","name":"guideImg","height":66}}]},{"type":"Button","props":{"y":300,"x":568,"var":"changeDirectionBtn","stateNum":"1","skin":"assets/pokers/rubbedPoker/btn_rotate.png","anchorY":0.5,"anchorX":0.5}}]};}
		]);
		return RubbedPokerDialogUI;
	})(Dialog);
var ShowPokerTypeDialogUI=(function(_super){
		function ShowPokerTypeDialogUI(){
			
		    this.viewBox=null;
		    this.pokerTypeList=null;

			ShowPokerTypeDialogUI.__super.call(this);
		}

		CLASS$(ShowPokerTypeDialogUI,'ui.Dialogs.Room.ShowPokerTypeDialogUI',_super);
		var __proto__=ShowPokerTypeDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ShowPokerTypeDialogUI.uiView);
		}

		STATICATTR$(ShowPokerTypeDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Box","props":{"y":47,"x":0,"width":317,"var":"viewBox","height":459},"child":[{"type":"Image","props":{"y":2.1316282072803006e-14,"x":-3.552713678800501e-14,"skin":"assets/ui.room/showPokerType/img_jiemian.png"}},{"type":"Image","props":{"y":59.000000000000014,"x":21.999999999999982,"skin":"assets/ui.room/showPokerType/img_01.png"}},{"type":"Image","props":{"y":20.000000000000014,"x":124.99999999999997,"skin":"assets/ui.room/showPokerType/img_paixing.png"}},{"type":"List","props":{"y":67,"x":29.000000000000078,"width":250,"var":"pokerTypeList","height":350}}]}]};}
		]);
		return ShowPokerTypeDialogUI;
	})(Dialog);
var ShowRuleDialogUI=(function(_super){
		function ShowRuleDialogUI(){
			
		    this.titleImg=null;
		    this.customizedBox=null;
		    this.customizedTen=null;
		    this.customizedTwenty=null;
		    this.customizedThirty=null;
		    this.roomSetBox=null;
		    this.conditionBox=null;
		    this.bigThenStraightCheck=null;
		    this.bigThenGodCheck=null;
		    this.roundNumSetBox=null;
		    this.tenRoundCheck=null;
		    this.twentyRoundCheck=null;
		    this.turnJokersBox=null;
		    this.noMoreJokerCheck=null;
		    this.oneMoreCheck=null;
		    this.twoMoreCheck=null;
		    this.jokerAnyCheck=null;
		    this.jokerFormationCheak=null;
		    this.nineGhostCheck=null;
		    this.betBox=null;
		    this.anyBetCheck=null;
		    this.moreBetCheck=null;
		    this.autoBetCheck=null;
		    this.zeroSetBox=null;
		    this.winDoubleGhostCheck=null;
		    this.tripleWinDoubleGhostCheck=null;
		    this.tripleWinTripleGhostCheck=null;
		    this.doubleDealBox=null;
		    this.doubleCheck=null;
		    this.gambleBox=null;
		    this.fancyWinCheck=null;
		    this.multipeBox=null;

			ShowRuleDialogUI.__super.call(this);
		}

		CLASS$(ShowRuleDialogUI,'ui.Dialogs.Room.ShowRuleDialogUI',_super);
		var __proto__=ShowRuleDialogUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("Text",laya.display.Text);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ShowRuleDialogUI.uiView);
		}

		STATICATTR$(ShowRuleDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"mouseThrough":false,"mouseEnabled":true,"height":640},"child":[{"type":"Image","props":{"y":320,"x":568,"width":703,"skin":"assets/ui.room/showRule/bg_jiemian.png","pivotY":242,"pivotX":351,"mouseEnabled":true,"height":539}},{"type":"Image","props":{"y":366,"x":568,"width":593,"skin":"assets/ui.room/showRule/bg_01.png","height":435,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":127,"x":568,"var":"titleImg","skin":"assets/ui.room/showRule/img_chakanguize.png","anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":176,"x":276,"width":585,"visible":"false","var":"customizedBox","mouseEnabled":false,"height":335},"child":[{"type":"Text","props":{"y":87,"x":16,"text":"牌型倍数 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":163,"x":16,"text":"点数倍数 :","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":85,"x":131,"width":72,"text":"同花顺","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":85,"x":348,"width":72,"text":"顺   子","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":115,"x":132,"width":72,"text":"三   条","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":115,"x":348,"width":72,"visible":false,"text":"双   鬼","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":164,"x":348,"width":72,"text":"2   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":197,"x":348,"width":72,"text":"4   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":234,"x":348,"width":72,"text":"6   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":270,"x":348,"width":72,"text":"8   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":164,"x":132,"width":72,"text":"1   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":197,"x":132,"width":72,"text":"3   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":234,"x":132,"width":72,"text":"5   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":270,"x":132,"width":72,"text":"7   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":304,"x":132,"width":72,"text":"9   点","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":85,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":115,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":164,"x":478,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":198,"x":478,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":235,"x":478,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":271,"x":478,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":85,"x":478,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":116,"x":478,"visible":false,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":164,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":198,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":235,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":271,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":304,"x":264,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":85,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":119,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":85,"x":422,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":119,"x":422,"visible":false,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":100,"x":208,"visible":false,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":163,"x":422,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":198,"x":422,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":234,"x":422,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":269,"x":422,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":163,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":198,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":234,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":269,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":304,"x":208,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Label","props":{"y":86,"x":208,"width":46,"valign":"middle","text":"10","name":"straightFlushLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":86,"x":422,"width":46,"valign":"middle","text":"10","name":"straightLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":121,"x":208,"width":46,"valign":"middle","text":"10","name":"threesLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":121,"x":422,"width":46,"visible":false,"valign":"middle","text":"10","name":"doubleGhostLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":99,"x":207,"width":49,"visible":false,"valign":"middle","text":"10","name":"point_0","height":30,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":165,"x":208,"width":46,"valign":"middle","text":"10","name":"point_1","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":165,"x":422,"width":46,"valign":"middle","text":"10","name":"point_2","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":200,"x":208,"width":46,"valign":"middle","text":"10","name":"point_3","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":200,"x":422,"width":46,"valign":"middle","text":"10","name":"point_4","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":236,"x":208,"width":46,"valign":"middle","text":"10","name":"point_5","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":236,"x":422,"width":46,"valign":"middle","text":"10","name":"point_6","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":271,"x":208,"width":46,"valign":"middle","text":"10","name":"point_7","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":271,"x":422,"width":46,"valign":"middle","text":"10","name":"point_8","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":305,"x":208,"width":46,"valign":"middle","text":"10","name":"point_9","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Box","props":{"y":-5,"x":15,"width":560,"name":"roundSetBox","height":74},"child":[{"type":"Text","props":{"y":1,"x":3,"text":"局数选择：","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":121,"var":"customizedTen","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":1,"x":38,"width":49.9755859375,"text":"10局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x5）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":292,"var":"customizedTwenty","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":1,"x":38,"text":"20局","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x8）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":36,"x":121,"var":"customizedThirty","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":1,"x":38,"width":49.9755859375,"text":"30局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x10）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]}]}]},{"type":"Button","props":{"y":79,"x":854,"stateNum":"2","skin":"assets/ui.button/btn_Close.png","name":"close"}},{"type":"Box","props":{"y":174,"x":279,"width":568,"var":"roomSetBox","height":374},"child":[{"type":"Box","props":{"y":42,"x":4,"width":578,"visible":true,"var":"conditionBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"上庄条件：","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":1,"x":115,"var":"bigThenStraightCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":40,"text":"顺子以上","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":1,"x":290,"var":"bigThenGodCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":41,"text":"天公以上","fontSize":"23","font":"Microsoft YaHei","color":"#f9f9f9"}}]}]},{"type":"Box","props":{"y":4,"x":4,"width":578,"var":"roundNumSetBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"局数选择：","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":0,"x":115,"var":"tenRoundCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":38,"width":49.9755859375,"text":"10局","height":23,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":88,"text":"（钻石x1）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":0,"x":290,"var":"twentyRoundCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":42,"text":"20局","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":8,"x":92,"text":"（钻石x2）","fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":80,"x":4,"width":578,"var":"turnJokersBox","height":73},"child":[{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"鬼       牌 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":1,"x":115,"var":"noMoreJokerCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"不翻鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":1,"x":290,"var":"oneMoreCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":45,"text":"翻鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":11,"x":439,"var":"twoMoreCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_S.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":3,"x":25,"text":"翻2张","fontSize":"13","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":40,"x":115,"var":"jokerAnyCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"鬼牌百变","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":40,"x":290,"var":"jokerFormationCheak","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":42,"text":"鬼牌成型","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":47,"x":439,"var":"nineGhostCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_S.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"带鬼天公双倍","fontSize":"13","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":156,"x":4,"width":578,"var":"betBox","height":35},"child":[{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"下注功能 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":1,"x":115,"var":"anyBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"任意下注","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":1,"x":290,"var":"moreBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-3,"x":42,"wordWrap":true,"width":94,"text":"一杠到底","height":29,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":1,"x":290,"visible":false,"var":"autoBetCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-3,"x":42,"wordWrap":true,"width":94,"text":"默认下注","height":29,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":225,"x":4,"width":578,"var":"zeroSetBox","height":35},"child":[{"type":"CheckBox","props":{"y":2,"x":115,"var":"winDoubleGhostCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":38,"text":"赢双鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"木       虱 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"CheckBox","props":{"y":2,"x":230,"var":"tripleWinDoubleGhostCheck","stateNum":"2","skin":"assets/ui.button/btn_Choice.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":38,"text":"三倍赢双鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":3,"x":390,"var":"tripleWinTripleGhostCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":38,"text":"三倍赢三鬼","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":300,"x":4,"width":578,"var":"doubleDealBox","height":35},"child":[{"type":"CheckBox","props":{"y":1,"x":115,"var":"doubleCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png","mouseThrough":false},"child":[{"type":"Text","props":{"y":-2,"x":39,"text":"加入功能牌","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"功  能  牌 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Box","props":{"y":263,"x":4,"width":578,"var":"gambleBox","height":37},"child":[{"type":"CheckBox","props":{"y":2,"x":115,"var":"fancyWinCheck","stateNum":"3","skin":"assets/ui.button/btn_Selected_L.png","mouseEnabled":false},"child":[{"type":"Text","props":{"y":-2,"x":38,"text":"有倍赢无倍","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"比       牌 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Box","props":{"y":188,"x":4,"width":578,"var":"multipeBox","height":38},"child":[{"type":"Text","props":{"y":0,"x":0,"width":110,"text":"牌型倍数 :","height":30,"fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":4,"x":119,"text":"同花顺","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":4,"x":291,"text":"三   条","fontSize":"23","font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":4,"x":252,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":4,"x":423,"valign":"middle","text":"倍","fontSize":23,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":4,"x":196,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Image","props":{"y":4,"x":367,"skin":"assets/ui.select/img_beishukuang.png"}},{"type":"Label","props":{"y":5,"x":198,"width":42,"valign":"middle","text":"10","name":"straightFlushLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}},{"type":"Label","props":{"y":5,"x":370,"width":42,"valign":"middle","text":"10","name":"threesLab","height":26,"fontSize":22,"color":"#ffb16c","align":"center"}}]}]}]};}
		]);
		return ShowRuleDialogUI;
	})(Dialog);
var SelectMultipleDialogUI=(function(_super){
		function SelectMultipleDialogUI(){
			
		    this.multipleList=null;

			SelectMultipleDialogUI.__super.call(this);
		}

		CLASS$(SelectMultipleDialogUI,'ui.Dialogs.SelectMultipleDialogUI',_super);
		var __proto__=SelectMultipleDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SelectMultipleDialogUI.uiView);
		}

		STATICATTR$(SelectMultipleDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":170,"x":368,"width":400,"skin":"assets/ui.main/img_0002.png","sizeGrid":"12,7,9,10","height":300}},{"type":"List","props":{"y":220,"x":418,"width":300,"var":"multipleList","height":200}}]};}
		]);
		return SelectMultipleDialogUI;
	})(Dialog);
var GameRoomViewUI=(function(_super){
		function GameRoomViewUI(){
			
		    this.yellowTable=null;
		    this.functionsBox=null;
		    this.roomIdLab=null;
		    this.roundLab=null;
		    this.chatBtn=null;
		    this.voiceChatBtn=null;
		    this.recordbtn=null;
		    this.settingBtn=null;
		    this.showRuleBtn=null;
		    this.battery=null;
		    this.wifi=null;
		    this.standUpBtn=null;
		    this.disbandBtn=null;
		    this.lobbyBtn=null;
		    this.pokerTypeBtn=null;
		    this.timeclockLab=null;
		    this.disbandGray=null;
		    this.lobbyGray=null;
		    this.standUpGray=null;
		    this.playersBox=null;
		    this.bankerOperationBox=null;
		    this.allOpenBtn=null;
		    this.openOutsBtn=null;
		    this.bankerOutsBtn=null;
		    this.bankerOutsActionBtn=null;
		    this.operationBox=null;
		    this.outsBtn=null;
		    this.outsActionBtn=null;
		    this.passBtn=null;
		    this.showToOtherBtn=null;
		    this.bidBox=null;
		    this.finalBtn=null;
		    this.readyBtn=null;
		    this.readyBtnImg=null;
		    this.countdownLab=null;
		    this.countdownImg=null;
		    this.grabBankerBtn=null;
		    this.noDoBanker=null;
		    this.bankerTick=null;

			GameRoomViewUI.__super.call(this);
		}

		CLASS$(GameRoomViewUI,'ui.Views.GameRoomViewUI',_super);
		var __proto__=GameRoomViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameRoomViewUI.uiView);
		}

		STATICATTR$(GameRoomViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"stateNum":"1","height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"assets/ui.room/bg_table.png","height":640}},{"type":"Image","props":{"y":202.00000000000003,"x":163.99999999999991,"visible":false,"var":"yellowTable","skin":"assets/ui.room/bg_yellow.png"}},{"type":"Box","props":{"y":1.0000000000000207,"x":2.9999999999999587,"width":1144,"var":"functionsBox","height":643},"child":[{"type":"Image","props":{"y":0,"x":568,"skin":"assets/ui.room/img_upper.png","anchorY":0,"anchorX":0.5}},{"type":"Image","props":{"y":-3.2529534621517087e-14,"x":454,"skin":"assets/ui.room/img_upper2.png"}},{"type":"Label","props":{"y":35,"x":488,"width":58,"text":"房号:","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":36,"x":540,"width":115,"var":"roomIdLab","text":"332233","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":2,"x":578,"width":94,"var":"roundLab","text":"1/10局","height":32,"fontSize":17,"font":"Microsoft YaHei","color":"#fff260","align":"left"}},{"type":"Button","props":{"y":581,"x":2,"var":"chatBtn","stateNum":"2","skin":"assets/ui.room/icon_chat.png","labelSize":20}},{"type":"Button","props":{"y":581,"x":82,"var":"voiceChatBtn","stateNum":"2","skin":"assets/ui.room/icon_Voice2.png","labelSize":20}},{"type":"Button","props":{"y":581,"x":162,"var":"recordbtn","stateNum":"2","skin":"assets/ui.room/icon_Record.png","labelSize":20}},{"type":"Button","props":{"y":6,"x":238,"var":"settingBtn","stateNum":"2","skin":"assets/ui.room/icon_setup.png","labelStrokeColor":"#ffffff","labelSize":20}},{"type":"Button","props":{"y":7,"x":306,"var":"showRuleBtn","stateNum":"2","skin":"assets/ui.room/icon_gameplay.png","labelStrokeColor":"#ffffff","labelSize":20}},{"type":"Image","props":{"y":7,"x":494,"var":"battery","skin":"assets/ui.room/icon_Battery.png"},"child":[{"type":"Image","props":{"y":2,"x":3,"skin":"assets/ui.room/icon_Battery2.png"}},{"type":"Image","props":{"y":2,"x":8,"skin":"assets/ui.room/icon_Battery2.png"}},{"type":"Image","props":{"y":2,"x":13,"skin":"assets/ui.room/icon_Battery2.png"}}]},{"type":"Image","props":{"y":6,"x":470,"var":"wifi","skin":"assets/ui.room/icon_WIFI.png"}},{"type":"Image","props":{"y":579,"x":-3.999999999999876,"width":1136,"skin":"assets/ui.room/img_0002.png","height":61}},{"type":"Button","props":{"y":33.5,"x":867,"var":"standUpBtn","stateNum":"2","skin":"assets/ui.room/icon_Standup.png","labelSize":30,"labelColors":"#FFFFFF","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":33,"x":713,"var":"disbandBtn","stateNum":"2","skin":"assets/ui.room/icon_dissolution.png","labelSize":30,"labelColors":"#FFFFFF","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":35,"x":797,"var":"lobbyBtn","stateNum":"2","skin":"assets/ui.room/icon_Return.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":7,"x":395,"var":"pokerTypeBtn","stateNum":"2","skin":"assets/ui.room/icon_CardType.png"}},{"type":"Label","props":{"y":2,"x":524,"width":49,"var":"timeclockLab","text":"12:00","height":24,"fontSize":17,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":7,"x":683,"var":"disbandGray","skin":"assets/ui.room/icon_dissolution_j.png"}},{"type":"Image","props":{"y":9,"x":767,"var":"lobbyGray","skin":"assets/ui.room/icon_Return_j.png"}},{"type":"Image","props":{"y":6,"x":848,"var":"standUpGray","skin":"assets/ui.room/icon_Standup_j.png"}}]},{"type":"Box","props":{"y":167,"x":123,"width":898,"var":"playersBox","height":378},"child":[{"type":"Sprite","props":{"y":333,"x":428,"name":"player_0"}},{"type":"Sprite","props":{"y":333,"x":746,"name":"player_1"}},{"type":"Sprite","props":{"y":173,"x":886,"name":"player_2"}},{"type":"Sprite","props":{"y":-19,"x":756,"name":"player_3"}},{"type":"Sprite","props":{"y":-19,"x":438,"name":"player_4"}},{"type":"Sprite","props":{"y":-19,"x":150,"name":"player_5"}},{"type":"Sprite","props":{"y":173,"x":11,"name":"player_6"}},{"type":"Sprite","props":{"y":333,"x":140,"name":"player_7"}},{"type":"Sprite","props":{"y":158,"x":428,"name":"deckNode"}},{"type":"Box","props":{"y":90,"x":142,"width":633,"name":"ghostBox","height":178}},{"type":"Box","props":{"y":-32,"x":-22,"width":975,"name":"lightBox","height":420},"child":[{"type":"Image","props":{"y":169,"x":474,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":180,"name":"light_0","height":193,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":201,"x":473,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":115,"name":"light_1","height":335,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":202,"x":439,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":90,"name":"light_2","height":459,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":203,"x":463,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":63,"name":"light_3","height":361,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":232,"x":476,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":0,"name":"light_4","height":193,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":214,"x":477,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":-57,"name":"light_5","height":321,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":210,"x":472,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":-90,"name":"light_6","height":409,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":199,"x":480,"width":102,"skin":"assets/ui.room/img_lighting1.png","rotation":241,"name":"light_7","height":328,"anchorY":1,"anchorX":0.5}}]}]},{"type":"Box","props":{"y":607,"x":585,"width":519,"visible":false,"var":"bankerOperationBox","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":9,"x":9,"var":"allOpenBtn","stateNum":"2","skin":"assets/ui.room/btn_04.png"},"child":[{"type":"Image","props":{"y":11,"x":30,"skin":"assets/ui.room/img_Open.png"}}]},{"type":"Button","props":{"y":9,"x":137,"var":"openOutsBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":11,"x":30,"skin":"assets/ui.room/img_Openup.png"}}]},{"type":"Button","props":{"y":9,"x":264,"var":"bankerOutsBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":10,"x":28,"skin":"assets/ui.room/img_supplement2.png"}}]},{"type":"Button","props":{"y":9,"x":392,"var":"bankerOutsActionBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":10,"x":28,"skin":"assets/ui.room/img_Shuffling2.png"}}]}]},{"type":"Box","props":{"y":603,"x":583,"width":507,"visible":false,"var":"operationBox","height":60,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":12,"x":132,"var":"outsBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":10,"x":29,"skin":"assets/ui.room/img_supplement2.png"}}]},{"type":"Button","props":{"y":12,"x":261,"var":"outsActionBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":10,"x":29,"skin":"assets/ui.room/img_Shuffling2.png"}}]},{"type":"Button","props":{"y":13,"x":389,"var":"passBtn","stateNum":"2","skin":"assets/ui.room/btn_01.png"},"child":[{"type":"Image","props":{"y":10,"x":29,"skin":"assets/ui.room/img_skip.png"}}]},{"type":"Button","props":{"y":12,"x":4,"var":"showToOtherBtn","stateNum":"2","skin":"assets/ui.room/btn_04.png"},"child":[{"type":"Image","props":{"y":10,"x":29,"skin":"assets/ui.room/img_opendeal.png"}}]}]},{"type":"Box","props":{"y":584,"x":337,"width":519,"visible":false,"var":"bidBox","height":54},"child":[{"type":"Button","props":{"y":0,"x":-2,"stateNum":"2","skin":"assets/ui.room/btn_03.png","name":"bet_0","labelStrokeColor":"#ffffff","labelSize":25,"labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":8,"x":41,"skin":"assets/ui.room/img_num_X.png"}},{"type":"Image","props":{"y":10,"x":63,"skin":"assets/ui.room/img_num_1.png"}}]},{"type":"Button","props":{"y":0,"x":127,"stateNum":"2","skin":"assets/ui.room/btn_03.png","name":"bet_1","labelSize":25,"labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":10,"x":63,"skin":"assets/ui.room/img_num_2.png"}},{"type":"Image","props":{"y":8,"x":41,"skin":"assets/ui.room/img_num_X.png"}}]},{"type":"Button","props":{"y":-1,"x":254,"stateNum":"2","skin":"assets/ui.room/btn_03.png","name":"bet_2","labelSize":25,"labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":8,"x":41,"skin":"assets/ui.room/img_num_X.png"}},{"type":"Image","props":{"y":10,"x":63,"skin":"assets/ui.room/img_num_3.png"}}]},{"type":"Button","props":{"y":1,"x":382,"stateNum":"2","skin":"assets/ui.room/btn_03.png","name":"bet_3","labelSize":25,"labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":10,"x":63,"skin":"assets/ui.room/img_num_4.png"}},{"type":"Image","props":{"y":8,"x":41,"skin":"assets/ui.room/img_num_X.png"}}]}]},{"type":"Button","props":{"y":326,"x":503,"visible":false,"var":"finalBtn","stateNum":"2","skin":"assets/ui.room/btn_blue.png","labelSize":20,"labelColors":"#FFFFFF"},"child":[{"type":"Image","props":{"y":20,"x":19,"skin":"assets/ui.room/img_Next.png"}}]},{"type":"Button","props":{"y":308,"x":499,"var":"readyBtn","stateNum":"2","skin":"assets/ui.room/btn_yellow.png"},"child":[{"type":"Image","props":{"y":38,"x":87,"var":"readyBtnImg","skin":"assets/ui.room/img_GetReady.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":305,"x":486,"visible":false,"var":"countdownLab","skin":"assets/ui.room/img_Count down.png"},"child":[{"type":"Image","props":{"y":35,"x":63,"var":"countdownImg","skin":"assets/ui.room/img_Count_down3.png"}}]},{"type":"Button","props":{"y":316,"x":499,"visible":false,"var":"grabBankerBtn","stateNum":"2","skin":"assets/ui.room/btn_yellow.png","labelSize":20,"labelColors":"#ffffff"},"child":[{"type":"Image","props":{"y":19,"x":48,"skin":"assets/ui.room/img_rob.png"}}]},{"type":"Image","props":{"y":591,"x":1007,"var":"noDoBanker","skin":"assets/ui.room/img_banker.png"},"child":[{"type":"Image","props":{"y":8,"x":12,"var":"bankerTick","skin":"assets/ui.room/img_Tick.png"}}]}]};}
		]);
		return GameRoomViewUI;
	})(View);
var LoaderViewUI=(function(_super){
		function LoaderViewUI(){
			
		    this.message=null;
		    this.percent=null;
		    this.progress=null;

			LoaderViewUI.__super.call(this);
		}

		CLASS$(LoaderViewUI,'ui.Views.LoaderViewUI',_super);
		var __proto__=LoaderViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoaderViewUI.uiView);
		}

		STATICATTR$(LoaderViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"x":0,"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.loader/bg.png"}},{"type":"Label","props":{"y":550,"x":502,"var":"message","text":"Loading..","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Label","props":{"y":578,"x":826,"var":"percent","text":"0%","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Image","props":{"skin":"assets/ui.loader/logo.png"}},{"type":"Image","props":{"y":589,"x":322,"skin":"assets/ui.loader/progressBg.png"}},{"type":"ProgressBar","props":{"y":591,"x":324,"var":"progress","skin":"assets/ui.loader/progress.png"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var LobbyViewUI=(function(_super){
		function LobbyViewUI(){
			
		    this.createRoomBtn=null;
		    this.enterRoomBtn=null;
		    this.playerInfoBox=null;
		    this.nameLab=null;
		    this.balanceLab=null;
		    this.headIcon=null;
		    this.headIconTouch=null;
		    this.addBalanceBtn=null;
		    this.bottomBox=null;
		    this.newBtn=null;
		    this.explanBtn=null;
		    this.shareBtn=null;
		    this.settingsBtn=null;
		    this.effortBtn=null;
		    this.notifyLab=null;
		    this.wechatLab=null;
		    this.phoneLab=null;
		    this.bulletinShow=null;
		    this.bulletinNode=null;

			LobbyViewUI.__super.call(this);
		}

		CLASS$(LobbyViewUI,'ui.Views.LobbyViewUI',_super);
		var __proto__=LobbyViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyViewUI.uiView);
		}

		STATICATTR$(LobbyViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.main/BG_02.png"}},{"type":"Image","props":{"y":107,"x":154,"skin":"assets/ui.main/img_girl.png"}},{"type":"Image","props":{"y":0,"x":416,"skin":"assets/ui.main/logo.png"}},{"type":"Button","props":{"y":171,"x":726,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.main/btn_02.png"}},{"type":"Button","props":{"y":372,"x":726,"var":"enterRoomBtn","stateNum":"2","skin":"assets/ui.main/btn_03.png"}},{"type":"Box","props":{"y":5,"x":23,"width":317,"var":"playerInfoBox","height":94},"child":[{"type":"Image","props":{"y":5,"x":54,"width":219,"skin":"assets/ui.main/img_0004.png","height":35}},{"type":"Image","props":{"y":42,"x":61,"width":180,"skin":"assets/ui.main/img_0004.png","height":35}},{"type":"Label","props":{"y":7,"x":90,"width":173,"var":"nameLab","text":"你的名字","height":25,"fontSize":25,"font":"Arial","color":"#ffffff","bold":true}},{"type":"Label","props":{"y":49,"x":123,"width":91,"var":"balanceLab","text":"0","height":21,"fontSize":20,"font":"Arial","color":"#ebde25","align":"center"}},{"type":"Image","props":{"y":1.0000000000000053,"x":-5.000000000000028,"width":82,"var":"headIcon","skin":"assets/ui.room/img_head_icon.png","height":82},"child":[{"type":"Image","props":{"y":-2,"x":-2,"width":86,"skin":"assets/ui.room/img_head_mask.png","renderType":"mask","height":86}}]},{"type":"Image","props":{"y":0.9999999999999938,"x":-4.999999999999961,"width":82,"skin":"assets/ui.room/img_head.png","height":82}},{"type":"Box","props":{"y":8,"x":1,"width":67,"var":"headIconTouch","height":69}},{"type":"Button","props":{"y":44,"x":216,"var":"addBalanceBtn","stateNum":"2","skin":"assets/ui.main/btn_01.png"},"child":[{"type":"Image","props":{"y":6,"x":5,"skin":"assets/ui.main/img_plus.png"}}]},{"type":"Image","props":{"y":48,"x":87,"skin":"assets/ui.main/icon_roomcard.png"}}]},{"type":"Box","props":{"y":560,"x":0,"width":1136,"var":"bottomBox","height":80},"child":[{"type":"Image","props":{"skin":"assets/ui.main/img_0007.png"}},{"type":"Button","props":{"y":25,"x":89,"var":"newBtn","stateNum":"2","skin":"assets/ui.main/img_notice.png"}},{"type":"Button","props":{"y":16,"x":721,"var":"explanBtn","stateNum":"2","skin":"assets/ui.main/img_gameplay.png"}},{"type":"Button","props":{"y":33,"x":513,"var":"shareBtn","stateNum":"2","skin":"assets/ui.main/icon_share.png"}},{"type":"Button","props":{"y":22,"x":927,"var":"settingsBtn","stateNum":"2","skin":"assets/ui.main/img_setup.png"}},{"type":"Button","props":{"y":30,"x":293,"var":"effortBtn","stateNum":"2","skin":"assets/ui.main/img_record.png"}}]},{"type":"Image","props":{"y":188,"x":-4,"skin":"assets/ui.main/img_0003.png"}},{"type":"Image","props":{"y":260,"x":28,"skin":"assets/ui.main/img_0002.png"},"child":[{"type":"Label","props":{"y":15,"x":15,"wordWrap":true,"width":179,"var":"notifyLab","text":"      所有玩家数据、运算均由服务器端下发，任何人都不可通过外挂破解客户端等手段前提获知其他玩家手牌或公共牌。","leading":15,"height":151,"fontSize":15,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":196,"x":8,"wordWrap":true,"width":189,"var":"wechatLab","text":"公众微信：1111111111","leading":15,"height":26,"fontSize":15,"font":"Microsoft YaHei","color":"#ffb87a"}},{"type":"Label","props":{"y":225,"x":7,"wordWrap":true,"width":192,"var":"phoneLab","text":"联系电话：","leading":15,"height":26,"fontSize":15,"font":"Microsoft YaHei","color":"#ffb87a"}}]},{"type":"Image","props":{"y":212,"x":85,"skin":"assets/ui.main/img_BulletinBoard.png"}},{"type":"Image","props":{"y":114,"x":352,"width":550,"var":"bulletinShow","skin":"assets/ui.main/img_0004.png","height":35},"child":[{"type":"Image","props":{"y":3,"x":59,"skin":"assets/ui.main/icon_horn.png"}},{"type":"Panel","props":{"y":2.842170943040401e-14,"x":94.00000000000006,"width":416,"var":"bulletinNode","height":35}}]}]};}
		]);
		return LobbyViewUI;
	})(View);
var LoginViewUI=(function(_super){
		function LoginViewUI(){
			
		    this.wxAuthorizeBtn=null;
		    this.guestBtn=null;
		    this.revision=null;
		    this.agreementText=null;

			LoginViewUI.__super.call(this);
		}

		CLASS$(LoginViewUI,'ui.Views.LoginViewUI',_super);
		var __proto__=LoginViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoginViewUI.uiView);
		}

		STATICATTR$(LoginViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"x":0,"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.loader/bg.png"}},{"type":"Button","props":{"y":443,"x":568,"var":"wxAuthorizeBtn","stateNum":"2","skin":"assets/ui.button/btn_wxdl.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":67,"x":381,"skin":"assets/ui.loader/logo.png"}},{"type":"Button","props":{"y":528,"x":567,"var":"guestBtn","stateNum":"2","skin":"assets/ui.button/btn_yk.png","labelSize":30,"labelColors":"#ffffff","labelBold":true,"labelAlign":"center","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":12,"x":51,"skin":"assets/ui.loader/img_yk.png"}}]},{"type":"CheckBox","props":{"y":574,"x":482,"stateNum":"2","skin":"assets/ui.button/btn_gouxuan.png","selected":true},"child":[{"type":"Label","props":{"y":6,"x":42,"width":129,"text":"同意用户协议","height":31,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":4,"x":979,"var":"revision","valign":"middle","text":"版本号：1.0.0.636","fontSize":18,"font":"Microsoft YaHei","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":615,"x":187,"width":779,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","height":21,"fontSize":14,"font":"Microsoft YaHei","color":"#faae6c"}},{"type":"Box","props":{"y":582,"x":520,"width":128,"var":"agreementText","height":26}}]};}
		]);
		return LoginViewUI;
	})(View);