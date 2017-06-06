/**
 * 玩法说明
 */
var ExplainDialog = (function(_super) {

    function createImage (url,name) {
        var image = new Laya.Image();
        //console.log("createImage = " + url);
        image.skin = "assets/ui.explan/" + url;
        //image.pivot(image.width/2, image.height/2);
        image.name = name;
        return image;
    }

    function createBtn (url) {
        var btn = new Laya.Button();
        btn.skin = "assets/ui.explan/" + url;
        btn.stateNum = 2;
        //btn.pivot(btn.width/2, btn.height/2);
        return btn;
    }

    function createLabel (text,font,name,fontsize) {
        var label = new Laya.Label();
        label.text = text;
        label.font = font || "Microsoft YaHei";
        label.fontSize = fontsize || 22;
        label.color = "#ffffff";
        //label.bold = true;
        label.leading = 10;
        //label.padding = "5,0,0,0";
        label.name = name;
        //label.pivot(label.width/2,label.height/2);
        return label;
    };

    function ExplainItem() {
        ExplainItem.super(this);
        this.size(730, 455);

        this.setData = function(cellSrc)
        {
            //console.log("width == " + width + " height = " + height);
            //this.width = width;
            //this.height = height*2;
            //console.log(cellSrc);
            //cellSrc._parent = null;
            //this.addChild(cellSrc);
            var data;
            for(var i = 0 ; i < cellSrc.length ; i++)
            {
                data = cellSrc[i];
                console.log(data);
                this.addChild(data);
                //if(data.title)
                //    this.addChild(data.title);
                //
                //if(data.details)
                //    this.addChild(data.details);
            }
        }
    }

    Laya.class(ExplainItem, "ExplainItem", Laya.Box);

    function ExplainDialog() {
        ExplainDialog.super(this);

        this.init();
        //this.testPokerEffect();
    }

    Laya.class(ExplainDialog, "ExplainDialog", _super);

    ExplainDialog.prototype.init = function() {

        //this.changeExplain(this.classicalBtn);

        //this.initTouchEvent();

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

        //this.viewList.repeatY = pagesData.length;

        this.viewList.array = pagesData;

        //this.initList();
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

            //title = /\.png$/.test(data.title)?createImage(data.title,"title"):createLabel(data.title, data.font, "title", 22);
            //title.x = posX;
            //
            //details = /\.png$/.test(data.details)?createImage(data.details,"details"):createLabel(data.details, data.font, "details", 20);
            //details.x = posX;

            var t = data.title;
            var d = data.details;

            this.calculateLab(data.title,"title",22);
            this.calculateLab(data.details,"details",18);

            //result = this.checkIsOutOfList(data.title, data.details, listHeight, heightCount);
            //
            //this.createWrap(title);
            //this.createWrap(details);
            //

            //
            ////result = this.checkIsOutOfList(title, details, listHeight, heightCount);
            //
            //if(result)
            //{
            //    if(result.nextPage)
            //    {
            //        heightCount = 0;
            //        pagesCount = pagesCount + 1;
            //    }
            //
            //    if(result.cutLine)
            //    {
            //        var cutLine = result.cutLine;
            //        if(cutLine.insideStrings.length != 0)
            //        {
            //            var insideString = cutLine.insideStrings.join("");
            //            insideString = insideString.replace(/N/g,"\n");
            //            details.text = insideString;
            //            this.createWrap(details);
            //        }
            //
            //        if(cutLine.outsideStrings.length != 0)
            //        {
            //            var outsideStrings = cutLine.outsideStrings.join("");
            //            outsideStrings = outsideStrings.replace(/N/g,"\n");
            //            outsideDetails = createLabel(outsideStrings, null, "outsideDetails", 20);
            //            outsideDetails.x = posX;
            //            this.createWrap(outsideDetails);
            //        }
            //    }
            //}
            //
            //
            //title.y = heightCount;
            //
            //heightCount += title.height;
            //
            //details.y = heightCount;
            //
            //heightCount += details.height;
            //
            //leading = 5;
            //
            //this.insertPage(pagesData, pagesCount, title, details);
            //
            //if(outsideDetails)
            //{
            //    heightCount = 0;
            //    pagesCount = pagesCount + 1;
            //
            //    outsideDetails.y = heightCount;
            //
            //    heightCount += outsideDetails.height;
            //
            //    this.insertPage(pagesData, pagesCount, null, outsideDetails);
            //
            //    outsideDetails = null;
            //}

        }
        var y;
        var lab;
        //var heightCount = 0;
        for(i = 0 ; i < this.allLabel.length ; i++)
        {
            pagesData[i] = [];
            heightCount = 0;
            for(y = 0 ; y < this.allLabel[i].length ;y++)
            {
                lab = this.allLabel[i][y];
                //lab.x = posX;
                //lab.y = heightCount;
                //
                //heightCount += lab.height + 10;
                pagesData[i].push({title:lab});
                //
                //details = /\.png$/.test(data.details)?createImage(data.details,"details"):createLabel(data.details, data.font, "details", 20);
                //details.x = posX;
            }
        }

        this.viewList.repeatX = 1;
        //this.viewList.repeatY = this.allLabel.length;
        this.viewList.repeatY = pagesData.length;

        //this.viewList.array = this.allLabel;
        this.viewList.array = pagesData;
    };

    ExplainDialog.prototype.updateItem = function(cell) {
        console.log(cell.dataSource);
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

