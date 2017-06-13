/**
 * 玩法说明
 */
var ExplainDialog = (function(_super) {

    function createImage (url,name) {
        var image = new Laya.Image();
        image.skin = "assets/ui.explan/" + url;
        image.name = name;
        return image;
    }

    function createBtn (url) {
        var btn = new Laya.Button();
        btn.skin = "assets/ui.explan/" + url;
        btn.stateNum = 2;
        return btn;
    }

    function createLabel (text,font,name,fontsize) {
        var label = new Laya.Label();
        label.text = text;
        label.font = font || "Microsoft YaHei";
        label.fontSize = fontsize || 22;
        label.color = "#ffffff";
        label.leading = 10;
        label.name = name;
        return label;
    };

    function ExplainItem() {
        ExplainItem.super(this);
        this.size(730, 455);

        this.setData = function(cellSrc)
        {
            var data;
            for(var i = 0 ; i < cellSrc.length ; i++)
            {
                data = cellSrc[i];
                this.addChild(data);
            }
        }
    }

    Laya.class(ExplainItem, "ExplainItem", Laya.Box);

    function ExplainDialog() {
        ExplainDialog.super(this);

        this.init();
    }

    Laya.class(ExplainDialog, "ExplainDialog", _super);

    ExplainDialog.prototype.init = function() {
        this.allLabel = [];
        this.allLabel[0] = [];
        this.pagesCount = 0;
        this.countHeight = 0;

        this.viewList.vScrollBarSkin = "";
        this.viewList.itemRender = ExplainItem;
        this.viewList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.viewList.selectEnable = true;

        var pagesData = [[],[],[],[]];
        pagesData[0].push(this.page1);
        pagesData[1].push(this.page2);
        pagesData[2].push(this.page3);
        pagesData[3].push(this.page4);

        this.viewList.array = pagesData;
    };

    ExplainDialog.prototype.initTouchEvent = function() {

        this.classicalBtn.on(Laya.Event.CLICK,this,this.onClickBtn);
        this.staticBtn.on(Laya.Event.CLICK,this,this.onClickBtn);
        this.chaosBtn.on(Laya.Event.CLICK,this,this.onClickBtn);
        this.customizedBtn.on(Laya.Event.CLICK,this,this.onClickBtn);

    };

    ExplainDialog.prototype.initList = function() {

        this.viewList.vScrollBarSkin = "";
        this.viewList.itemRender = ExplainItem;
        this.viewList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.viewList.selectEnable = true;

        var listWidth = this.viewList.width;
        var listHeight = this.viewList.height;

        var data;
        var title;
        var details;
        var insideDetails;
        var outsideDetails;
        var heightCount = 0;
        var pagesData = [];
        var pagesCount = 0;
        var wrapCount;
        var posX = 5;
        var leading = 0;
        var result;
        // 计算要多少页
        var i;
        for(i = 0 ; i < Game.Game.Explain.length ; i++)
        {
            data = Game.Game.Explain[i];

            var t = data.title;
            var d = data.details;

            this.calculateLab(data.title,"title",22);
            this.calculateLab(data.details,"details",18);
        }
        var y;
        var lab;
        for(i = 0 ; i < this.allLabel.length ; i++)
        {
            pagesData[i] = [];
            heightCount = 0;
            for(y = 0 ; y < this.allLabel[i].length ;y++)
            {
                lab = this.allLabel[i][y];
                pagesData[i].push({title:lab});
            }
        }

        this.viewList.repeatX = 1;
        this.viewList.repeatY = pagesData.length;

        this.viewList.array = pagesData;
    };

    ExplainDialog.prototype.updateItem = function(cell) {
        cell.setData(cell.dataSource);
    };

    ExplainDialog.prototype.calculateLab = function(str, name, fontSize) {
        var i;
        var lab = createLabel("", null, null, fontSize);

        var countWidth = 0;
        var lineString = "";

        for(i = 0 ; i < str.length ; i++)
        {
            lab.text = str[i];
            // 如果遇到主动的换行符
            if(str[i] == "N")
            {
                this.checkCreateNewPage(lab,lineString,name,fontSize);

                lineString = "";
                countWidth = 0;
                continue;
            }

            countWidth = countWidth + lab.width;
            if(countWidth > this.viewList.width)
            {
                // 超过宽度，换一行
                this.checkCreateNewPage(lab,lineString,name,fontSize);

                lineString = str[i];
                countWidth = 0;
            }
            else
            {
                lineString += str[i];
            }
        }

        if(lineString != "")
        {
            lab.text = lineString;
            this.checkCreateNewPage(lab,lineString,name,fontSize);
        }
    };

    ExplainDialog.prototype.checkCreateNewPage = function(lab,str,name,fontSize) {
        var resultLab = createLabel(str, null, name, fontSize);
        resultLab.x = 10;
        resultLab.y = this.countHeight;

        this.countHeight = this.countHeight + lab.height;
        this.allLabel[this.pagesCount] = this.allLabel[this.pagesCount] ||[];
        this.allLabel[this.pagesCount].push(resultLab);

        if(this.countHeight > this.viewList.height)
        {
            // 如果这一行超过了高度，增加一页
            this.pagesCount += 1;
            this.countHeight = 0;
        }
    };

    ExplainDialog.prototype.testPokerEffect = function() {
        this.page1.visible = false;
        this.page2.visible = false;
        this.page3.visible = false;
        this.page4.visible = false;
    };


    ExplainDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return ExplainDialog;
}(ExplanDialogUI));

