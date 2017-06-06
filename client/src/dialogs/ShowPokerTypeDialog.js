var ShowPokerTypeDialog = (function(_super) {

    var all_Type = [
        {
            name:"双鬼",
            details:[
                [
                    "assets/pokers/joker_14.png",
                    "assets/pokers/joker_15.png"
                ]
            ]
        },

        {
            name:"天公",
            details:[
                [
                    "assets/pokers/club_3.png",
                    "assets/pokers/diamond_5.png"
                ],

                [
                    "assets/pokers/heart_8.png",
                    "assets/pokers/club_1.png"
                ]
            ]
        },

        {
            name:"三条",
            details:[
                [
                    "assets/pokers/club_1.png",
                    "assets/pokers/heart_1.png",
                    "assets/pokers/spade_1.png"
                ]
            ]
        },

        {
            name:"同花顺",
            details:[
                [
                    "assets/pokers/spade_11.png",
                    "assets/pokers/spade_12.png",
                    "assets/pokers/spade_13.png"
                ]
            ]
        },

        {
            name:"顺子",
            details:[
                [
                    "assets/pokers/diamond_8.png",
                    "assets/pokers/heart_9.png",
                    "assets/pokers/club_10.png"
                ]
            ]
        },

        {
            name:"无牌型",
            details:[
                [
                    "assets/pokers/club_3.png",
                    "assets/pokers/heart_8.png",
                ],

                [
                    "assets/pokers/diamond_5.png",
                    "assets/pokers/club_1.png",
                    "assets/pokers/heart_1.png",
                ]
            ]
        },

        {
            name:"木虱",
            details:[
                [
                    "assets/pokers/club_3.png",
                    "assets/pokers/heart_7.png"
                ],

                [
                    "assets/pokers/heart_8.png",
                    "assets/pokers/club_1.png",
                    "assets/pokers/heart_1.png"
                ]
            ]
        }
    ];

    function pokerTypeItem() {
        pokerTypeItem.super(this);

        this.size(250, 50);

        // 下划线
        this.downLineImage = new Laya.Image();
        this.downLineImage.skin = "assets/ui.room/showPokerType/img_fengexian.png";
        this.downLineImage.pivot(this.downLineImage.width/2,this.downLineImage.height/2);
        this.downLineImage.x = this.width/2;
        this.downLineImage.y = this.height - this.downLineImage.height/2;
        this.addChild(this.downLineImage);

        // 牌型名字
        this.typeName = new Laya.Label();
        this.typeName.font = "Microsoft YaHei";
        this.typeName.fontSize = 22;
        this.typeName.color = "#ffffff";
        this.addChild(this.typeName);

        // 牌型
        this.typeBox = new Laya.Box();
        this.typeBox.width = 170;
        this.typeBox.height = 66;
        this.typeBox.pivotY = this.typeBox.height/2;
        this.typeBox.x = 80;
        this.typeBox.y = this.height/2;
        this.addChild(this.typeBox);

        this.setData = function(src) {

            this.typeName.text = src.name;
            this.typeName.pivot(0,this.typeName.height/2);
            this.typeName.x = 5;
            this.typeName.y = this.height/2;

            var pokerImage;
            var pokerTypes;
            var posX = 0;
            for(var i = 0 ; i < src.details.length ; i++)
            {
                pokerTypes = src.details[i];
                for(var typeIndex = 0 ; typeIndex < pokerTypes.length ; typeIndex++)
                {
                    pokerImage = new Laya.Image();
                    pokerImage.skin = pokerTypes[typeIndex];
                    pokerImage.pivot(0,pokerImage.height/2);
                    pokerImage.x = posX;
                    pokerImage.y = this.typeBox.height/2;
                    pokerImage.scale(0.15,0.15);
                    this.typeBox.addChild(pokerImage);

                    posX = posX + (pokerImage.width*pokerImage.scaleX)/2;
                }
                posX = posX + (pokerImage.width*pokerImage.scaleX);
            }
        };
    }

    Laya.class(pokerTypeItem, "pokerTypeItem", Laya.Box);

    function ShowPokerTypeDialog() {
        ShowPokerTypeDialog.super(this);

        //this.closeBtn.on(Laya.Event.CLICK,this,this.close);
        var self = this;
        this.viewBox.on(Laya.Event.MOUSE_DOWN,this,function(){
            self.off(Laya.Event.CLICK,self,self.close);
        });
        this.viewBox.on(Laya.Event.MOUSE_UP,this,function(){
            self.on(Laya.Event.CLICK,self,self.close);
        });
        this.on(Laya.Event.CLICK,this,this.close);
        this.initView();
    }

    Laya.class(ShowPokerTypeDialog, "ShowPokerTypeDialog", _super);

    ShowPokerTypeDialog.prototype.initView = function() {

        this.pokerTypeList.vScrollBarSkin = "";
        this.pokerTypeList.itemRender = pokerTypeItem;
        this.pokerTypeList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.pokerTypeList.selectEnable = true;


        this.pokerTypeList.repeatX = 1;
        this.pokerTypeList.repeatY = all_Type.length;

        this.pokerTypeList.array = all_Type;

    };

    ShowPokerTypeDialog.prototype.updateItem = function(cell) {
        //console.log("cell.dataSource = ");
        //console.log(cell.dataSource);
        cell.setData(cell.dataSource);
    };

    ShowPokerTypeDialog.prototype.close = function() {
        var touchPos = this.getMousePoint();

        var pos = this.viewBox.globalToLocal(touchPos);
        if(pos.x < this.viewBox.width && pos.x > this.viewBox.x && pos.y > this.viewBox.y - 30  && pos.y < (this.viewBox.y + this.viewBox.height))
        {
            return;
        }

        _super.prototype.close.call(this);
        this.removeSelf();
    };

    return ShowPokerTypeDialog;
}(ShowPokerTypeDialogUI));
