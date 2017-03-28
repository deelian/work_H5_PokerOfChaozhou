var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var InputRoomNumDialogUI=(function(_super){
		function InputRoomNumDialogUI(){
			
		    this.keyBoardBox=null;
		    this.reInputBtn=null;
		    this.deleteBtn=null;
		    this.roomNumLab=null;

			InputRoomNumDialogUI.__super.call(this);
		}

		CLASS$(InputRoomNumDialogUI,'ui.Dialogs.InputRoomNumDialogUI',_super);
		var __proto__=InputRoomNumDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(InputRoomNumDialogUI.uiView);
		}

		STATICATTR$(InputRoomNumDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1000,"mouseThrough":false,"mouseEnabled":true,"height":700},"child":[{"type":"Image","props":{"y":59,"x":37,"skin":"assets/ui.image/bg.png","mouseEnabled":true}},{"type":"Label","props":{"y":78,"x":322,"text":"请输入房间号","fontSize":50,"color":"#fdfdfd"}},{"type":"Box","props":{"y":216,"x":298,"width":388,"var":"keyBoardBox","height":401},"child":[{"type":"Button","props":{"y":16,"x":0,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_1"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"1","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":16,"x":136,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_2"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"2","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":16,"x":273,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_3"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"3","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":116,"x":4,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_4"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"4","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":116,"x":140,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_5"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"5","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":116,"x":277,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_6"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"6","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":207,"x":5,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_7"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"7","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":207,"x":141,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_8"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"8","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":207,"x":278,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_9"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"9","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":304,"x":8,"var":"reInputBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":14,"x":11,"text":"重输","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":304,"x":144,"stateNum":"2","skin":"assets/ui.button/btn_003.png","name":"num_0"},"child":[{"type":"Label","props":{"y":12,"x":36,"text":"0","fontSize":40,"color":"#ffffff"}}]},{"type":"Button","props":{"y":304,"x":281,"var":"deleteBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":12,"x":12,"text":"删除","fontSize":40,"color":"#ffffff"}}]}]},{"type":"Label","props":{"y":155,"x":361,"var":"roomNumLab","text":"111111111","fontSize":50,"color":"#ffffff","align":"center"}},{"type":"Button","props":{"y":36,"x":922,"stateNum":"2","skin":"assets/ui.button/btn_008.png","name":"close"}}]};}
		]);
		return InputRoomNumDialogUI;
	})(Dialog);
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){
			

			MessageDialogUI.__super.call(this);
		}

		CLASS$(MessageDialogUI,'ui.Dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":600,"height":400}};}
		]);
		return MessageDialogUI;
	})(Dialog);
var SelectModeDialogUI=(function(_super){
		function SelectModeDialogUI(){
			
		    this.createRoomBtn=null;
		    this.roomSetBox=null;
		    this.roundNumSetBox=null;
		    this.turnJokersBox=null;
		    this.jokerEffectBox=null;
		    this.skyGrandpaBox=null;
		    this.betBox=null;

			SelectModeDialogUI.__super.call(this);
		}

		CLASS$(SelectModeDialogUI,'ui.Dialogs.SelectModeDialogUI',_super);
		var __proto__=SelectModeDialogUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("Text",laya.display.Text);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SelectModeDialogUI.uiView);
		}

		STATICATTR$(SelectModeDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1000,"mouseThrough":false,"mouseEnabled":true,"height":720},"child":[{"type":"Image","props":{"y":31,"x":58,"width":900,"skin":"assets/ui.image/bg.png","mouseEnabled":true,"height":680}},{"type":"Button","props":{"y":4,"x":913,"stateNum":"2","skin":"assets/ui.button/btn_008.png","name":"close"}},{"type":"Box","props":{"y":163,"x":79,"width":132,"height":446},"child":[{"type":"Button","props":{"y":0,"x":9,"stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":-2,"text":"经典模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":125,"x":9,"stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":25,"x":2,"text":"长庄模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":251,"x":9,"stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":0,"text":"混战模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":376,"x":9,"stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":-1,"text":"定制模式","fontSize":25,"color":"#ffffff"}}]}]},{"type":"Button","props":{"y":616,"x":268,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":21,"x":12,"text":"创建房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Image","props":{"y":54,"x":219,"width":245,"skin":"assets/ui.image/mc.png","height":538}},{"type":"Image","props":{"y":52,"x":492,"width":429,"skin":"assets/ui.image/mc.png","height":635}},{"type":"Box","props":{"y":63,"x":505,"width":404,"var":"roomSetBox","height":614},"child":[{"type":"Box","props":{"y":4,"x":1,"width":407,"var":"roundNumSetBox","height":34},"child":[{"type":"Radio","props":{"y":9,"x":125,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-2.9999999999999787,"x":22,"text":"10局","fontSize":"20","color":"#ffffff"}}]},{"type":"Radio","props":{"y":9,"x":249,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-2.9999999999999787,"x":29,"text":"20局","fontSize":"20","color":"#ffffff"}}]},{"type":"Text","props":{"y":5,"x":17,"text":"局数：","fontSize":"20","font":"Arial","color":"#ffffff"}}]},{"type":"Box","props":{"y":55,"x":16,"width":381,"var":"turnJokersBox","height":64},"child":[{"type":"Text","props":{"text":"翻鬼牌：","fontSize":"20","color":"#ffffff"}},{"type":"Radio","props":{"y":32,"x":5,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-1,"x":25,"text":"不翻鬼牌","fontSize":"15","color":"#ffffff"}}]},{"type":"Radio","props":{"y":32,"x":108,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":0,"x":26,"text":"翻1张鬼牌","fontSize":"15","color":"#ffffff"}}]},{"type":"Radio","props":{"y":35,"x":233,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":1,"x":26,"text":"翻2张鬼牌","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":124,"x":19,"width":383,"var":"jokerEffectBox","height":59},"child":[{"type":"Text","props":{"text":"鬼牌功能：","fontSize":"20","color":"#ffffff"}},{"type":"Radio","props":{"y":35,"x":5,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-1,"x":22,"text":"鬼牌万能","fontSize":"15","color":"#ffffff"}}]},{"type":"Radio","props":{"y":35,"x":106,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":0,"x":23,"text":"鬼牌成型","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":196,"x":124,"width":203,"var":"skyGrandpaBox","height":25},"child":[{"type":"Radio","props":{"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-1,"x":22,"text":"鬼9天公","fontSize":"15","color":"#ffffff"}}]},{"type":"Radio","props":{"y":1,"x":121,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-1,"x":22,"text":"鬼8天公","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":229,"x":16,"width":377,"var":"betBox","height":96},"child":[{"type":"Text","props":{"text":"下注：","fontSize":"20","color":"#ffffff"}},{"type":"Radio","props":{"y":35,"x":10,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":0,"x":23,"text":"任意下注，玩家可随意选择所有下注选项","fontSize":"15","color":"#ffffff"}}]},{"type":"Radio","props":{"y":62,"x":11,"skin":"assets/comp/radio.png"},"child":[{"type":"Text","props":{"y":-2,"x":23,"wordWrap":true,"width":280,"text":"一杠到底，在同一个庄下，玩家下局下注不能比上一局下注小","height":39,"fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":335,"x":19,"width":355,"height":152},"child":[{"type":"Text","props":{"text":"牌型倍数：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":31,"x":1,"text":"同花顺：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":62,"x":1,"text":"三    条：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":92,"x":1,"text":"顺    子：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":123,"x":1,"text":"双    鬼：","fontSize":"20","color":"#ffffff"}}]}]}]};}
		]);
		return SelectModeDialogUI;
	})(Dialog);
var GameRoomViewUI=(function(_super){
		function GameRoomViewUI(){
			
		    this.closeBtn=null;

			GameRoomViewUI.__super.call(this);
		}

		CLASS$(GameRoomViewUI,'ui.Views.GameRoomViewUI',_super);
		var __proto__=GameRoomViewUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("Text",laya.display.Text);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameRoomViewUI.uiView);
		}

		STATICATTR$(GameRoomViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"y":-49,"x":-7,"width":1278,"skin":"assets/ui.image/table.jpg","height":767}},{"type":"Button","props":{"y":591,"x":626,"var":"closeBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Text","props":{"y":17,"x":40,"text":"返回","fontSize":"30","color":"#ffffff"}}]},{"type":"Button","props":{"y":591,"x":415,"stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Text","props":{"y":16,"x":20,"text":"准备","fontSize":"30","color":"#ffffff"}}]}]};}
		]);
		return GameRoomViewUI;
	})(View);
var LoaderViewUI=(function(_super){
		function LoaderViewUI(){
			
		    this.progress=null;
		    this.message=null;
		    this.percent=null;

			LoaderViewUI.__super.call(this);
		}

		CLASS$(LoaderViewUI,'ui.Views.LoaderViewUI',_super);
		var __proto__=LoaderViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoaderViewUI.uiView);
		}

		STATICATTR$(LoaderViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"ProgressBar","props":{"y":650,"x":540,"var":"progress","skin":"assets/ui.loader/progress.png"}},{"type":"Label","props":{"y":615,"x":592,"var":"message","text":"Loading..","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Label","props":{"y":645,"x":796,"var":"percent","text":"0%","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Label","props":{"y":284,"x":549,"text":"加载界面","fontSize":50,"color":"#ffffff"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var LobbyViewUI=(function(_super){
		function LobbyViewUI(){
			
		    this.createRoomBtn=null;
		    this.enterRoomBtn=null;

			LobbyViewUI.__super.call(this);
		}

		CLASS$(LobbyViewUI,'ui.Views.LobbyViewUI',_super);
		var __proto__=LobbyViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyViewUI.uiView);
		}

		STATICATTR$(LobbyViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Button","props":{"y":425,"x":372,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":17,"x":12,"text":"创建房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Button","props":{"y":423,"x":744,"var":"enterRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":14,"x":14,"text":"加入房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Label","props":{"y":234,"x":440,"text":"游戏大厅","fontSize":100,"color":"#ffffff"}}]};}
		]);
		return LobbyViewUI;
	})(View);
var LoginViewUI=(function(_super){
		function LoginViewUI(){
			
		    this.loginBtn=null;

			LoginViewUI.__super.call(this);
		}

		CLASS$(LoginViewUI,'ui.Views.LoginViewUI',_super);
		var __proto__=LoginViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoginViewUI.uiView);
		}

		STATICATTR$(LoginViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Button","props":{"y":567,"x":610,"var":"loginBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":20,"x":13,"text":"微信登录","fontSize":30,"color":"#ffffff"}}]},{"type":"Label","props":{"y":262,"x":454,"width":400,"text":"登录界面","height":108,"fontSize":100,"color":"#ffffff"}}]};}
		]);
		return LoginViewUI;
	})(View);