var SelectMultipleDialog = (function(_super) {

    var multipleItem = function() {
        multipleItem.super(this);
        this.size(300,50);

        this.bg = new Laya.Image();
        this.bg.sizeGrid = "11,10,7,7";
        this.bg.size(300,50);
        this.bg.skin = "assets/ui.select/img_beishukuang.png";
        this.bg.pivot(this.bg.width/2,this.bg.height/2);
        this.bg.x = this.width/2;
        this.bg.y = this.height/2;
        this.addChild(this.bg);

        this.multipleLab = new Laya.Label();
        this.multipleLab.font = "Microsoft YaHei";
        this.multipleLab.fontSize = 22;
        this.multipleLab.color = "#ffffff";
        this.addChild(this.multipleLab);

        this.setData = function(src) {
            this.multipleLab.text = src[0]+"倍";
            this.multipleLab.pivot(this.multipleLab.width/2,this.multipleLab.height/2);
            this.multipleLab.x = this.width/2;
            this.multipleLab.y = this.height/2;
        };
    };

    Laya.class(multipleItem, "multipleItem", Laya.Box);

    function SelectMultipleDialog(info) {
        SelectMultipleDialog.super(this);

        this.info = info;

        //this.multipleBg.hitArea = new Laya.Rectangle(0,0,50,50);
        //this.on(Laya.Event.MOUSE_DOWN, this, this.touchDown);
        //this.on(Laya.Event.MOUSE_MOVE, this, this.touchMove);
        //this.on(Laya.Event.MOUSE_UP, this, this.touchUp);
        //this.on(Laya.Event.MOUSE_OUT, this, this.touchOut);

        this.allMultiples = this.createMultiple(info);

        this.initList();

        //this.currentSelectIndex = 0;
        //this.changeValue();
        //this.upLab.visible = false;
        //this.middleLab.visible = true;
        //this.downLab.visible = false;
    }

    Laya.class(SelectMultipleDialog, "SelectMultipleDialog", _super);

    var __proto = SelectMultipleDialog.prototype;

    __proto.initList = function() {
        this.multipleList.vScrollBarSkin = "";
        this.multipleList.itemRender = multipleItem;
        this.multipleList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.multipleList.selectHandler = new Laya.Handler(this, this.onSelectItem);

        this.multipleList.selectEnable = true;

        var pagesData = [];
        for(var i = 0 ; i < this.allMultiples.length ; i++)
        {
            pagesData[i] = [];
            pagesData[i].push(this.allMultiples[i]);
        }

        this.multipleList.repeatX = 1;
        this.multipleList.repeatY = pagesData.length;

        this.multipleList.array = pagesData;

    };

    __proto.updateItem = function(cell) {
        cell.setData(cell.dataSource);
    };

    __proto.onSelectItem = function(index) {
        var multiple = this.multipleList.getItem(index)[0];
        //var multipleLab = cell.multipleLab.text.replace("倍","");
        this.event("multipleChange",[multiple]);
        this.removeSelf();
    };

    __proto.showAllItem = function() {
        this.upLab.visible = true;
        this.middleLab.visible = true;
        this.downLab.visible = true;
    };

    __proto.touchDown = function() {
        this.multipleList.visible = true;
        this.lastMovePosY = Laya.stage.mouseY;
        this.mouseDown = true;
        this.showAllItem();
    };

    __proto.touchMove = function() {

        var diff = this.lastMovePosY - Laya.stage.mouseY;
        this.lastMovePosY = Laya.stage.mouseY;
        if(this.mouseDown && diff > 0)                              // 上滑
        {
            this.changeValue("up");
        }
        else if(this.mouseDown && diff < 0)                         // 下滑
        {
            this.changeValue("down");
        }
    };

    __proto.touchUp = function() {
        this.mouseDown = false;
        this.upLab.visible = false;
        this.middleLab.visible = true;
        this.downLab.visible = false;
        this.event("multipleChange",this);
    };

    __proto.touchOut = function() {
        if(this.mouseDown)
        {
            this.mouseDown = false;
            this.upLab.visible = false;
            this.middleLab.visible = true;
            this.downLab.visible = false;
            this.event("multipleChange",this);
        }
    };

    __proto.changeValue = function(type) {
        if(type == "up")
        {
            this.currentSelectIndex += 1;
        }
        else if(type == "down")
        {
            this.currentSelectIndex -= 1;
        }

        this.currentSelectIndex = this.currentSelectIndex > this.allMultiples.length - 1 ? this.allMultiples.length - 1:this.currentSelectIndex;

        this.currentSelectIndex = this.currentSelectIndex < 0 ? 0:this.currentSelectIndex;

        this.upLab.text = this.allMultiples[this.currentSelectIndex - 1] || "";
        this.middleLab.text = this.allMultiples[this.currentSelectIndex] || "";
        this.downLab.text = this.allMultiples[this.currentSelectIndex + 1] || "";
    };

    __proto.setValue = function(middleText) {
        for(var i = 0 ; i < this.allMultiples.length ; i++)
        {
            if(this.allMultiples[i] == middleText)
            {
                this.currentSelectIndex = i;
                break;
            }
        }

        this.changeValue();
    };

    __proto.createMultiple = function(data) {
        var values = [];
        for(var i = data.min; i <= data.max; i++)
        {
            values.push(i);
        }
        return values;
    };

    return SelectMultipleDialog;
}(SelectMultipleDialogUI));