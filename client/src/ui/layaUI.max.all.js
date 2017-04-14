var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var RoomPlayerUI=(function(_super){
		function RoomPlayerUI(){
			
		    this.nameLab=null;
		    this.balanceLab=null;
		    this.headTouch=null;

			RoomPlayerUI.__super.call(this);
		}

		CLASS$(RoomPlayerUI,'ui.Boxs.RoomPlayerUI',_super);
		var __proto__=RoomPlayerUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RoomPlayerUI.uiView);
		}

		STATICATTR$(RoomPlayerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":122,"height":139},"child":[{"type":"Circle","props":{"y":43,"x":60,"radius":40,"lineWidth":1,"lineColor":"#ffffff","fillColor":"#ffffff"}},{"type":"Image","props":{"y":88,"x":12,"width":101,"skin":"assets/ui.image/mc.png","height":21}},{"type":"Image","props":{"y":114,"x":12,"width":101,"skin":"assets/ui.image/mc.png","height":21}},{"type":"Label","props":{"y":92,"x":14,"width":94,"var":"nameLab","text":"这个是名字","height":12,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":120,"x":18,"width":89,"var":"balanceLab","text":"0000","height":12,"color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":4,"x":20,"width":81,"var":"headTouch","height":79}}]};}
		]);
		return RoomPlayerUI;
	})(View);
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
var PlayerInfoDailogUI=(function(_super){
		function PlayerInfoDailogUI(){
			
		    this.nameLab=null;
		    this.balanceLan=null;
		    this.idLab=null;
		    this.invokeIdLab=null;

			PlayerInfoDailogUI.__super.call(this);
		}

		CLASS$(PlayerInfoDailogUI,'ui.Dialogs.PlayerInfoDailogUI',_super);
		var __proto__=PlayerInfoDailogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(PlayerInfoDailogUI.uiView);
		}

		STATICATTR$(PlayerInfoDailogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1280,"mouseThrough":false,"mouseEnabled":true,"height":720},"child":[{"type":"Image","props":{"y":75,"x":7,"width":1267,"skin":"assets/ui.image/bg.png","mouseEnabled":true,"height":587}},{"type":"Button","props":{"y":38,"x":1194,"stateNum":"2","skin":"assets/ui.button/btn_008.png","name":"close"}},{"type":"Box","props":{"y":101,"x":41,"width":1204,"height":539},"child":[{"type":"Circle","props":{"y":103,"x":157,"radius":100,"lineWidth":2,"lineColor":"#ffffff","fillColor":"#ff7a00"}},{"type":"Image","props":{"y":57,"x":323,"width":272,"skin":"assets/ui.image/mc.png","height":51}},{"type":"Image","props":{"y":133,"x":326,"width":268,"skin":"assets/ui.image/mc.png","height":53}},{"type":"Image","props":{"y":56,"x":752,"width":314,"skin":"assets/ui.image/mc.png","height":52}},{"type":"Image","props":{"y":134,"x":752,"width":314,"skin":"assets/ui.image/mc.png","height":52}},{"type":"Image","props":{"y":325,"x":23,"width":237,"skin":"assets/ui.image/mc.png","height":185}},{"type":"Image","props":{"y":329,"x":360,"width":412,"skin":"assets/ui.image/mc.png","height":182}},{"type":"Image","props":{"y":326,"x":818,"width":375,"skin":"assets/ui.image/mc.png","height":182}},{"type":"Label","props":{"y":65,"x":342,"width":230,"var":"nameLab","text":"这个是名字","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":142,"x":345,"width":230,"var":"balanceLan","text":"00000","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":67,"x":823,"width":192,"var":"idLab","text":"00000","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":67,"x":758,"width":56,"text":"id:","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":146,"x":871,"width":192,"var":"invokeIdLab","text":"00000","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":144,"x":760,"width":101,"text":"邀请码:","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":333,"x":93,"width":101,"text":"经验值","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":336,"x":512,"width":125,"text":"最大牌型","height":35,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":331,"x":940,"width":125,"text":"成就","height":35,"fontSize":30,"color":"#ffffff","align":"center"}}]}]};}
		]);
		return PlayerInfoDailogUI;
	})(Dialog);
var RuleDialogUI=(function(_super){
		function RuleDialogUI(){
			

			RuleDialogUI.__super.call(this);
		}

		CLASS$(RuleDialogUI,'ui.Dialogs.RuleDialogUI',_super);
		var __proto__=RuleDialogUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("Text",laya.display.Text);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RuleDialogUI.uiView);
		}

		STATICATTR$(RuleDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"y":70,"x":202,"skin":"assets/ui.image/bg.png"}},{"type":"Button","props":{"y":52,"x":1102,"stateNum":"2","skin":"assets/ui.button/btn_008.png","name":"close"}},{"type":"Text","props":{"y":82,"x":577,"text":"玩法说明","fontSize":"50","color":"#ffffff"}}]};}
		]);
		return RuleDialogUI;
	})(Dialog);
var SelectModeDialogUI=(function(_super){
		function SelectModeDialogUI(){
			
		    this.modeBtnBox=null;
		    this.classicalBtn=null;
		    this.staticBtn=null;
		    this.chaosBtn=null;
		    this.customizedBtn=null;
		    this.createRoomBtn=null;
		    this.autoSettingBtn=null;
		    this.roomSetBox=null;
		    this.conditionBox=null;
		    this.bigThenGodCheck=null;
		    this.bigThenStraightCheck=null;
		    this.roundNumSetBox=null;
		    this.tenRoundCheck=null;
		    this.twentyRoundCheck=null;
		    this.turnJokersBox=null;
		    this.noMoreJokerCheck=null;
		    this.oneMoreCheck=null;
		    this.twoMoreCheck=null;
		    this.jokerEffectBox=null;
		    this.jokerAnyCheck=null;
		    this.jokerFormationCheak=null;
		    this.skyGrandpaBox=null;
		    this.nineGhostCheck=null;
		    this.eightGhostCheck=null;
		    this.betBox=null;
		    this.anyBetCheck=null;
		    this.moreBetCheck=null;
		    this.multipeBox=null;
		    this.straightFlush=null;
		    this.threeOfAKind=null;
		    this.straight=null;
		    this.doubleJoker=null;
		    this.zeroSetBox=null;
		    this.threeZeroCheck=null;
		    this.twoZeroCheck=null;
		    this.doubleDealBox=null;
		    this.doubleCheck=null;
		    this.customizedBox=null;
		    this.gameRoundCustomized=null;
		    this.straightFlushCustomized=null;
		    this.straightCustomized=null;
		    this.threeOfAKindCustomized=null;
		    this.doubleJokerCustomized=null;

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
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1000,"mouseThrough":false,"mouseEnabled":true,"height":720},"child":[{"type":"Image","props":{"y":31,"x":58,"width":900,"skin":"assets/ui.image/bg.png","mouseEnabled":true,"height":680}},{"type":"Button","props":{"y":4.000000000000007,"x":913,"stateNum":"2","skin":"assets/ui.button/btn_008.png","name":"close"}},{"type":"Box","props":{"y":163,"x":79,"width":132,"var":"modeBtnBox","height":446},"child":[{"type":"Button","props":{"y":0,"x":9,"var":"classicalBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":-2,"text":"经典模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":125,"x":9,"var":"staticBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":25,"x":2,"text":"长庄模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":251,"x":9,"var":"chaosBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":0,"text":"混战模式","fontSize":25,"color":"#ffffff"}}]},{"type":"Button","props":{"y":376,"x":9,"var":"customizedBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Label","props":{"y":24,"x":-1,"text":"定制模式","fontSize":25,"color":"#ffffff"}}]}]},{"type":"Button","props":{"y":616,"x":268,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":21,"x":12,"text":"创建房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Button","props":{"y":626,"x":102.00000000000006,"var":"autoSettingBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":21,"x":12,"text":"恢复默认","fontSize":30,"color":"#ffffff"}}]},{"type":"Image","props":{"y":54,"x":219,"width":245,"skin":"assets/ui.image/mc.png","height":538}},{"type":"Image","props":{"y":52,"x":492,"width":429,"skin":"assets/ui.image/mc.png","height":635}},{"type":"Box","props":{"y":63,"x":505,"width":404,"var":"roomSetBox","height":614},"child":[{"type":"Box","props":{"y":19,"x":9,"width":357,"visible":false,"var":"conditionBox","height":35},"child":[{"type":"Text","props":{"y":8,"x":-3,"text":"上庄条件：","fontSize":"20","color":"#ffffff"}},{"type":"CheckBox","props":{"y":14,"x":104,"var":"bigThenGodCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1,"x":19,"text":"天公以上","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":16,"x":200,"var":"bigThenStraightCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1,"x":19,"text":"顺子以上","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":23,"x":-3,"width":407,"var":"roundNumSetBox","height":34},"child":[{"type":"Text","props":{"y":5,"x":17,"text":"局数：","fontSize":"20","color":"#ffffff"}},{"type":"CheckBox","props":{"y":11,"x":125,"var":"tenRoundCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-4,"x":23,"text":"10局","fontSize":"20","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":11,"x":225,"var":"twentyRoundCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-4,"x":25,"text":"20局","fontSize":"20","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":55,"x":16,"width":381,"var":"turnJokersBox","height":64},"child":[{"type":"Text","props":{"text":"翻鬼牌：","fontSize":"20","color":"#ffffff"}},{"type":"CheckBox","props":{"y":32,"x":5,"var":"noMoreJokerCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1.0000000000000284,"x":24.999999999999886,"text":"不翻鬼牌","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":32,"x":108,"var":"oneMoreCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":0,"x":25.999999999999773,"text":"翻1张鬼牌","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":35,"x":233,"var":"twoMoreCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1.0000000000000284,"x":25.999999999999773,"text":"翻2张鬼牌","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":124,"x":19,"width":383,"var":"jokerEffectBox","height":59},"child":[{"type":"Text","props":{"text":"鬼牌功能：","fontSize":"20","color":"#ffffff"}},{"type":"CheckBox","props":{"y":35,"x":5,"var":"jokerAnyCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1.0000000000000568,"x":22,"text":"鬼牌万能","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":35,"x":106,"var":"jokerFormationCheak","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-2.842170943040401e-14,"x":23,"text":"鬼牌成型","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":196,"x":126,"width":203,"visible":false,"var":"skyGrandpaBox","height":25},"child":[{"type":"CheckBox","props":{"var":"nineGhostCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-1,"x":21.999999999999773,"text":"鬼9天公","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"x":121,"var":"eightGhostCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":0,"x":21.999999999999773,"text":"鬼8天公","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":196,"x":16,"width":377,"var":"betBox","height":96},"child":[{"type":"Text","props":{"text":"下注：","fontSize":"20","color":"#ffffff"}},{"type":"CheckBox","props":{"y":35,"x":10,"var":"anyBetCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":0,"x":23,"text":"任意下注，玩家可随意选择所有下注选项","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":62,"x":11,"var":"moreBetCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":-2,"x":23,"wordWrap":true,"width":280,"text":"一杠到底，在同一个庄下，玩家下局下注不能比上一局下注小","height":39,"fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":302,"x":19,"width":355,"var":"multipeBox","height":152},"child":[{"type":"Text","props":{"text":"牌型倍数：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":31,"x":1,"text":"同花顺：","fontSize":"15","color":"#ffffff"}},{"type":"Text","props":{"y":62,"x":1,"text":"三    条：","fontSize":"15","color":"#ffffff"}},{"type":"Text","props":{"y":92,"x":1,"text":"顺    子：","fontSize":"15","color":"#ffffff"}},{"type":"Text","props":{"y":123,"x":1,"text":"双    鬼：","fontSize":"15","color":"#ffffff"}},{"type":"ComboBox","props":{"y":28,"x":63,"width":46,"var":"straightFlush","skin":"assets/comp/combobox.png","selectedIndex":0,"scrollBarSkin":"assets/comp/vscroll.png","height":23}},{"type":"ComboBox","props":{"y":62,"x":62,"width":46,"var":"threeOfAKind","skin":"assets/comp/combobox.png","selectedIndex":0,"scrollBarSkin":"assets/comp/vscroll.png","labels":"4,5,6,7,8,9,10","height":23}},{"type":"ComboBox","props":{"y":94,"x":63,"width":46,"var":"straight","skin":"assets/comp/combobox.png","selectedIndex":0,"scrollBarSkin":"assets/comp/vscroll.png","labels":"4,5,6,7,8,9,10","height":23}},{"type":"ComboBox","props":{"y":125,"x":64,"width":46,"visibleNum":5,"var":"doubleJoker","skin":"assets/comp/combobox.png","selectedIndex":0,"scrollBarSkin":"assets/comp/vscroll.png","labels":"10,11,12,13,14,15,16,17,18,19,20","height":23}}]},{"type":"Box","props":{"y":467,"x":1,"width":374,"var":"zeroSetBox","height":27},"child":[{"type":"CheckBox","props":{"y":1,"x":21,"var":"threeZeroCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":0,"x":24,"text":"3张牌0点赢双鬼","fontSize":"15","color":"#ffffff"}}]},{"type":"CheckBox","props":{"y":1,"x":167,"var":"twoZeroCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":1,"x":24,"text":"2张牌0点赢双鬼","fontSize":"15","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":498,"x":22,"width":353,"var":"doubleDealBox","height":50},"child":[{"type":"CheckBox","props":{"var":"doubleCheck","skin":"assets/comp/checkbox.png"},"child":[{"type":"Text","props":{"y":0,"x":23,"text":"翻倍牌","fontSize":"15","color":"#ffffff"}}]}]}]},{"type":"Box","props":{"y":73,"x":505,"width":413,"visible":"false","var":"customizedBox","height":596},"child":[{"type":"Text","props":{"text":"局数选择：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":76,"x":-1,"text":"牌型倍数：","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":255,"x":4,"text":"点数牌：","fontSize":"20","color":"#ffffff"}},{"type":"ComboBox","props":{"y":0,"x":104,"var":"gameRoundCustomized","skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png"}},{"type":"ComboBox","props":{"y":77,"x":175,"var":"straightFlushCustomized","skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":121,"x":175,"var":"straightCustomized","skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":164,"x":175,"var":"threeOfAKindCustomized","skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":208,"x":175,"var":"doubleJokerCustomized","skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","labels":"label1,label2"}},{"type":"Text","props":{"y":78,"x":102,"text":"同花顺","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":123,"x":103,"text":"顺子","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":168,"x":108,"text":"三条","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":210,"x":109,"text":"双鬼","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":307,"x":84,"text":"0点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":352,"x":84,"text":"2点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":397,"x":84,"text":"4点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":441,"x":84,"text":"6点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":486,"x":84,"text":"8点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":310,"x":221,"text":"1点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":355,"x":221,"text":"3点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":400,"x":221,"text":"5点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":444,"x":221,"text":"7点","fontSize":"20","color":"#ffffff"}},{"type":"Text","props":{"y":489,"x":221,"text":"9点","fontSize":"20","color":"#ffffff"}},{"type":"ComboBox","props":{"y":309,"x":121,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_0","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":310,"x":259,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_1","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":354,"x":121,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_2","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":355,"x":259,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_3","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":399,"x":121,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_4","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":400,"x":259,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_5","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":443,"x":121,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_6","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":444,"x":259,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_7","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":488,"x":121,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_8","labels":"label1,label2"}},{"type":"ComboBox","props":{"y":489,"x":259,"skin":"assets/comp/combobox.png","scrollBarSkin":"assets/comp/vscroll.png","name":"point_9","labels":"label1,label2"}}]}]};}
		]);
		return SelectModeDialogUI;
	})(Dialog);
var GameRoomViewUI=(function(_super){
		function GameRoomViewUI(){
			
		    this.roomIdLab=null;
		    this.playersBox=null;
		    this.deckNode=null;
		    this.functionsBox=null;
		    this.ruleBtn=null;
		    this.dealPokerBtn=null;
		    this.readyBtn=null;
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
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"y":-49,"x":-7,"width":1278,"skin":"assets/ui.image/table.jpg","height":767}},{"type":"Label","props":{"y":365,"x":570,"var":"roomIdLab","text":"4444444","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Label","props":{"y":363,"x":455,"text":"房间号：","fontSize":30,"font":"Arial","color":"#ffffff"}},{"type":"Box","props":{"y":0,"x":0,"width":1274,"var":"playersBox","height":723},"child":[{"type":"Sprite","props":{"y":662,"x":566,"name":"player_0"}},{"type":"Sprite","props":{"y":643,"x":807,"name":"player_1"}},{"type":"Sprite","props":{"y":582,"x":1063,"name":"player_2"}},{"type":"Sprite","props":{"y":388,"x":1150,"name":"player_3"}},{"type":"Sprite","props":{"y":206,"x":1051,"name":"player_4"}},{"type":"Sprite","props":{"y":133,"x":786,"name":"player_5"}},{"type":"Sprite","props":{"y":125,"x":530,"name":"player_6"}},{"type":"Sprite","props":{"y":148,"x":335,"name":"player_7"}},{"type":"Sprite","props":{"y":226,"x":123,"name":"player_8"}},{"type":"Sprite","props":{"y":409,"x":68,"name":"player_9"}},{"type":"Sprite","props":{"y":380.0000000000001,"x":888.0000000000001,"var":"deckNode"}}]},{"type":"Box","props":{"y":636,"x":21,"width":337,"var":"functionsBox","height":69},"child":[{"type":"Button","props":{"stateNum":"2","skin":"assets/ui.button/btn_003.png","labelSize":20,"label":"文字"}},{"type":"Button","props":{"y":1,"x":114,"stateNum":"2","skin":"assets/ui.button/btn_003.png","labelSize":20,"label":"语音"}},{"type":"Button","props":{"y":0,"x":232,"stateNum":"2","skin":"assets/ui.button/btn_003.png","labelSize":20,"label":"战绩"}},{"type":"Button","props":{"y":-607,"x":1119,"var":"ruleBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png","labelStrokeColor":"#ffffff","labelSize":20,"label":"查看规则"}}]},{"type":"Button","props":{"y":268,"x":570,"var":"dealPokerBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Text","props":{"y":16,"x":20,"text":"发牌","fontSize":"30","color":"#ffffff"}}]},{"type":"Button","props":{"y":420,"x":438.99999999999994,"var":"readyBtn","stateNum":"2","skin":"assets/ui.button/btn_003.png"},"child":[{"type":"Text","props":{"y":16,"x":20,"text":"准备","fontSize":"30","color":"#ffffff"}}]},{"type":"Button","props":{"y":422.00000000000006,"x":552.9999999999999,"var":"closeBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Text","props":{"y":17,"x":40,"text":"返回","fontSize":"30","color":"#ffffff"}}]}]};}
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
		    this.createBtnLab=null;
		    this.enterRoomBtn=null;
		    this.playerInfoBox=null;
		    this.nameLab=null;
		    this.headIconTouch=null;

			LobbyViewUI.__super.call(this);
		}

		CLASS$(LobbyViewUI,'ui.Views.LobbyViewUI',_super);
		var __proto__=LobbyViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LobbyViewUI.uiView);
		}

		STATICATTR$(LobbyViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Button","props":{"y":425,"x":372,"var":"createRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":17,"x":12,"var":"createBtnLab","text":"创建房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Button","props":{"y":423,"x":744,"var":"enterRoomBtn","stateNum":"2","skin":"assets/ui.button/btn_001.png"},"child":[{"type":"Label","props":{"y":14,"x":14,"text":"加入房间","fontSize":30,"color":"#ffffff"}}]},{"type":"Label","props":{"y":234,"x":440,"text":"游戏大厅","fontSize":100,"color":"#ffffff"}},{"type":"Box","props":{"y":13,"x":20,"width":207,"var":"playerInfoBox","height":94},"child":[{"type":"Circle","props":{"y":41,"x":36,"radius":36,"lineWidth":2,"lineColor":"#ffebe8","fillColor":"#ffa83b"}},{"type":"Image","props":{"y":39,"x":74,"width":128,"skin":"assets/ui.image/mc.png","height":18}},{"type":"Image","props":{"y":66,"x":63,"width":128,"skin":"assets/ui.image/mc.png","height":18}},{"type":"Label","props":{"y":43,"x":99,"var":"nameLab","text":"这个是名字","color":"#ffffff"}},{"type":"Label","props":{"y":70,"x":68,"width":113,"text":"000000","height":12,"color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":7,"x":2,"width":67,"var":"headIconTouch","height":69}}]}]};}
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